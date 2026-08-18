/**
 * RVGHS Chatbot — Telemetry & Dual-Write Analytics Engine
 * Tracks user interactions, messages, dwell time, and sends batched logs
 * to both WordPress MySQL (REST API) and Vercel/MongoDB.
 */

(function () {
    'use strict';

    // State & Configuration
    const PAGE_LOAD_TIME = Date.now();
    let telemetryQueue = [];

    // Session Management
    function getSessionId() {
        let sid = sessionStorage.getItem('rvghs_chat_session_id');
        if (!sid) {
            sid = 'sid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
            sessionStorage.setItem('rvghs_chat_session_id', sid);
        }
        return sid;
    }

    const SESSION_ID = getSessionId();

    // Resolves endpoints dynamically from WP localized settings or window globals
    function getEndpoints() {
        const settings = window.rvghsChatbotSettings || {};
        const wpRestUrl = settings.restUrl || window.rvghs_wp_url || (window.location.origin + '/wp-json/rvghs/v1');
        const vercelUrl = settings.vercelUrl || window.rvghs_vercel_url || '';
        return { wpRestUrl, vercelUrl };
    }

    // Main tracking function
    function trackEvent(eventType, data = {}) {
        const event = {
            eventType: eventType,
            data: data,
            timestamp: new Date().toISOString()
        };
        telemetryQueue.push(event);
    }

    // Expose globally for the Chatbot engine (app.js)
    window.rvghsTrackEvent = trackEvent;

    // --- Intercept Lead Submissions ---
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        if (typeof args[0] === 'string' && args[0].includes('api.web3forms.com/submit')) {
            try {
                if (args[1] && args[1].body) {
                    const payload = JSON.parse(args[1].body);
                    delete payload.access_key; // strip key for privacy
                    trackEvent('form_submit', { leadData: payload });
                }
            } catch(e) {
                console.error('[RVGHS Telemetry] Failed to intercept form data', e);
            }
        }
        return originalFetch.apply(this, args);
    };

    // --- Track UI Clicks ---
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!target) return;
        const interactive = target.closest('button') || target.closest('a') || (target.tagName === 'BUTTON' || target.tagName === 'A' ? target : null);
        if (interactive) {
            const elementId   = interactive.id || interactive.dataset.node || interactive.dataset.query || 'btn';
            const elementText = (interactive.innerText || interactive.title || interactive.getAttribute('aria-label') || 'icon').trim();
            trackEvent('click', { elementId, elementText: elementText.substring(0, 30) });
        }
    });

    // --- Track Hovers (>500ms) ---
    let hoverTimers = {};
    document.addEventListener('mouseover', (e) => {
        const target = e.target;
        if (target && (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a'))) {
            const el = target.closest('button') || target.closest('a') || target;
            const key = el.id || el.dataset.node || el.dataset.query || 'hover_target';
            hoverTimers[key] = Date.now();
        }
    });
    document.addEventListener('mouseout', (e) => {
        const target = e.target;
        if (target && (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a'))) {
            const el = target.closest('button') || target.closest('a') || target;
            const key = el.id || el.dataset.node || el.dataset.query || 'hover_target';
            if (hoverTimers[key]) {
                const duration = Date.now() - hoverTimers[key];
                if (duration > 500) {
                    trackEvent('hover', { elementId: key, durationMs: duration });
                }
                delete hoverTimers[key];
            }
        }
    });

    // --- Track Copy Events ---
    document.addEventListener('copy', () => {
        const text = document.getSelection() ? document.getSelection().toString() : '';
        if (text) trackEvent('copy', { length: text.length });
    });

    // --- Track Scroll Depth ---
    let maxScroll = 0;
    document.addEventListener('scroll', () => {
        const docHeight = document.body.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            const pct = Math.round((window.scrollY / docHeight) * 100);
            if (pct > maxScroll) maxScroll = pct;
        }
    });

    // --- Heartbeat (every 15s) ---
    setInterval(() => {
        const dwell = Math.round((Date.now() - PAGE_LOAD_TIME) / 1000);
        trackEvent('heartbeat', { dwellTimeSeconds: dwell, maxScrollPercent: maxScroll });
    }, 15000);

    // --- DUAL WRITE BATCH TRANSMITTER ---
    async function sendBatch(batch) {
        if (!batch || batch.length === 0) return;
        const { wpRestUrl, vercelUrl } = getEndpoints();
        
        const payloadObj = { 
            institute_id: 'rvghs',
            api_key: 'rvghs_key_12345',
            sessionId: SESSION_ID, 
            events: batch 
        };
        const payload = JSON.stringify(payloadObj);

        // Also save to LocalStorage for zero-latency local dashboard view
        try {
            const existingRaw = localStorage.getItem('rvghs_logs');
            let existing = existingRaw ? JSON.parse(existingRaw) : [];
            if (!Array.isArray(existing)) existing = [];
            const newEntries = batch.map(e => ({
                s: SESSION_ID,
                d: e.timestamp || new Date().toISOString(),
                t: e.eventType || 'message',
                i: e.data?.elementId || e.data?.intent || '',
                q: e.data?.elementText || e.data?.query || '',
                m: e.data || {}
            }));
            const updated = [...newEntries, ...existing].slice(0, 1000);
            localStorage.setItem('rvghs_logs', JSON.stringify(updated));
        } catch(err){}

        const requests = [];

        // 1. WordPress REST API (MySQL + WP Admin Dashboard)
        if (wpRestUrl) {
            const wpEndpoint = wpRestUrl.endsWith('/logs') ? wpRestUrl : (wpRestUrl.replace(/\/+$/, '') + '/logs');
            requests.push(
                fetch(wpEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload
                })
                .then(r => { 
                    if (!r.ok) throw new Error('WP HTTP ' + r.status); 
                })
                .catch(e => {
                    if (window.console && console.debug) console.debug('[RVGHS Telemetry] WP log note:', e.message);
                })
            );
        }

        // 2. Vercel Node.js API (MongoDB + External Dashboard)
        if (vercelUrl && vercelUrl.trim() !== '') {
            const vercelEndpoint = vercelUrl.replace(/\/+$/, '') + '/api/logs';
            requests.push(
                fetch(vercelEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: payload
                })
                .then(r => { 
                    if (!r.ok) throw new Error('Vercel HTTP ' + r.status); 
                })
                .catch(e => {
                    if (window.console && console.debug) console.debug('[RVGHS Telemetry] Vercel log note:', e.message);
                })
            );
        }

        await Promise.allSettled(requests);
    }

    // --- Batch Processor (every 5 seconds) ---
    setInterval(async () => {
        if (telemetryQueue.length === 0) return;
        const batch = [...telemetryQueue];
        telemetryQueue = [];
        await sendBatch(batch);
    }, 5000);

    // --- Flush on page unload (sendBeacon) ---
    window.addEventListener('beforeunload', () => {
        if (telemetryQueue.length === 0) return;
        const { wpRestUrl, vercelUrl } = getEndpoints();
        const payloadStr = JSON.stringify({ 
            institute_id: 'rvghs',
            api_key: 'rvghs_key_12345',
            sessionId: SESSION_ID, 
            events: telemetryQueue 
        });
        const blob = new Blob([payloadStr], { type: 'application/json' });

        if (wpRestUrl) {
            const wpEndpoint = wpRestUrl.endsWith('/logs') ? wpRestUrl : (wpRestUrl.replace(/\/+$/, '') + '/logs');
            navigator.sendBeacon(wpEndpoint, blob);
        }
        if (vercelUrl && vercelUrl.trim() !== '') {
            const vercelEndpoint = vercelUrl.replace(/\/+$/, '') + '/api/logs';
            navigator.sendBeacon(vercelEndpoint, blob);
        }
    });

    // --- Initial page load event ---
    trackEvent('page_load', { userAgent: navigator.userAgent });

})();
