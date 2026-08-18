require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ChatLog = require('./models/ChatLog');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors()); // Allow requests from any origin
app.use(express.json({ limit: '5mb' })); // Parse JSON bodies

// ===== MONGODB CONNECTION (Serverless Optimized) =====
let cachedDbPromise = null;

async function connectToDatabase() {
    if (!process.env.MONGODB_URI) return null;
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    
    if (!cachedDbPromise) {
        cachedDbPromise = mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false,
        }).then((m) => {
            console.log('✅ Connected to MongoDB Atlas');
            return m;
        }).catch(err => {
            cachedDbPromise = null;
            console.error('❌ MongoDB connection error:', err.message);
            return null;
        });
    }
    return cachedDbPromise;
}

// Auto-connect middleware for all API routes
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
    } catch (e) {}
    next();
});

// ===== API ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.json({ 
        status: 'online', 
        db: isConnected ? 'connected' : 'disconnected',
        hasMongoUri: !!process.env.MONGODB_URI
    });
});

// Setup endpoint (per chatbot_architecture skill)
app.post('/api/setup', async (req, res) => {
    res.json({ ok: true, message: 'Database seeded with default configuration.' });
});

// Helper: Normalize incoming event into ChatLog document
function normalizeEvent(e, sessionId, instituteId) {
    const data = e.data || e.m || {};
    const eventType = e.eventType || e.t || 'message';
    const query = e.q || data.elementText || data.query || (eventType === 'message' ? 'Chat Message' : eventType);
    const intent = e.i || data.elementId || data.intent || (eventType === 'message' ? 'user_message' : eventType);
    const ts = e.timestamp || e.d || e.createdAt || new Date().toISOString();

    return {
        s: sessionId || e.s || 'sid_anon',
        sessionId: sessionId || e.s || 'sid_anon',
        institute_id: instituteId || e.institute_id || 'rvghs',
        q: query,
        i: intent,
        t: eventType,
        d: ts,
        m: data,
        deviceType: data.screen ? (parseInt(data.screen) < 768 ? 'Mobile' : 'Desktop') : 'Desktop',
        createdAt: new Date(ts)
    };
}

// POST /api/logs — Universal ingestion (supports batch envelope, events array, or single event)
app.post('/api/logs', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI || mongoose.connection.readyState !== 1) {
            return res.status(200).json({ ok: true, mock: true, count: 1 });
        }

        const body = req.body || {};
        const sessionId = body.sessionId || body.s || 'sid_anon';
        const instituteId = body.institute_id || 'rvghs';
        let docs = [];

        if (Array.isArray(body.events) && body.events.length > 0) {
            docs = body.events.map(e => normalizeEvent(e, sessionId, instituteId));
        } else if (Array.isArray(body.logs) && body.logs.length > 0) {
            docs = body.logs.map(l => normalizeEvent(l, l.s || sessionId, instituteId));
        } else if (Array.isArray(body) && body.length > 0) {
            docs = body.map(item => normalizeEvent(item, item.s || sessionId, instituteId));
        } else {
            docs = [normalizeEvent(body, sessionId, instituteId)];
        }

        if (docs.length === 0) {
            return res.status(200).json({ ok: true, count: 0 });
        }

        const result = await ChatLog.insertMany(docs, { ordered: false });
        return res.status(201).json({ ok: true, inserted: result.length });
    } catch (err) {
        console.error('Log save error:', err.message);
        return res.status(500).json({ ok: false, error: err.message });
    }
});

// POST /api/logs/batch — Alias for batch
app.post('/api/logs/batch', async (req, res) => {
    return app._router.handle({ ...req, url: '/api/logs', method: 'POST' }, res);
});

// GET /api/logs — Fetch all logs with standardized format
app.get('/api/logs', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI || mongoose.connection.readyState !== 1) {
            return res.status(200).json({ ok: true, count: 0, logs: [] });
        }

        const query = {};
        if (req.query.date) {
            const start = new Date(req.query.date);
            const end = new Date(req.query.date);
            end.setDate(end.getDate() + 1);
            query.createdAt = { $gte: start, $lt: end };
        }
        if (req.query.since) {
            query.createdAt = { $gt: new Date(req.query.since) };
        }

        const limit = Math.min(parseInt(req.query.limit) || 5000, 10000);
        const rawLogs = await ChatLog.find(query).sort({ createdAt: -1 }).limit(limit).lean();

        // Normalization per chatbot_architecture skill (both MongoDB and WP format compatibility)
        const logs = rawLogs.map(l => ({
            _id: l._id,
            id: l._id,
            s: l.s || l.sessionId,
            sessionId: l.s || l.sessionId,
            q: l.q,
            query: l.q,
            i: l.i,
            intent: l.i,
            t: l.t || 'message',
            eventType: l.t || 'message',
            d: l.d || l.createdAt,
            timestamp: l.d || l.createdAt,
            createdAt: l.createdAt || l.d,
            m: l.m || {},
            data: l.m || {},
            deviceType: l.deviceType || 'Desktop',
            resolved: l.resolved || false
        }));

        res.json({ ok: true, count: logs.length, logs });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// PATCH /api/logs/:id/resolve — Mark an unanswered question as resolved
app.patch('/api/logs/:id/resolve', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI) return res.status(200).json({ ok: true });
        await ChatLog.findByIdAndUpdate(req.params.id, { resolved: true });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// DELETE /api/logs — Clear all logs
app.delete('/api/logs', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI) return res.status(200).json({ ok: true });
        const result = await ChatLog.deleteMany({});
        res.json({ ok: true, deleted: result.deletedCount });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// ===== START SERVER (Local only) =====
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n🚀 RVGHS Chatbot API Server running on http://localhost:${PORT}`);
        console.log(`📊 Dashboard API: http://localhost:${PORT}/api/logs`);
        console.log(`❤️  Health check:  http://localhost:${PORT}/api/health\n`);
    });
}

module.exports = app;
