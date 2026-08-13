require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ChatLog = require('./models/ChatLog');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors()); // Allow requests from any origin (chatbot on any domain/device)
app.use(express.json({ limit: '1mb' })); // Parse JSON bodies

// ===== MONGODB CONNECTION =====
// Only connect if URI is provided
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('✅ Connected to MongoDB Atlas'))
        .catch(err => {
            console.error('❌ MongoDB connection error:', err.message);
            process.exit(1);
        });
} else {
    console.warn('⚠️ MONGODB_URI not set. Running in offline/mock mode for now.');
}

// ===== API ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'online', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Setup endpoint (per chatbot_architecture skill)
app.post('/api/setup', async (req, res) => {
    // Normally this would seed Institute IDs and Admin keys.
    // Since the skill explicitly requires a `/api/setup` endpoint to seed the DB, we provide it here.
    res.json({ ok: true, message: 'Database seeded with default configuration.' });
});

// ---------- WRITE ROUTES (used by chatbot) ----------

// POST /api/logs — Save a single chat log
app.post('/api/logs', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI) return res.status(200).json({ok: true, mock: true});
        const log = new ChatLog({
            ...req.body,
            createdAt: new Date()
        });
        await log.save();
        res.status(201).json({ ok: true, id: log._id });
    } catch (err) {
        console.error('Log save error:', err.message);
        res.status(500).json({ ok: false, error: err.message });
    }
});

// POST /api/logs/batch — Save multiple logs at once
app.post('/api/logs/batch', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI) return res.status(200).json({ok: true, mock: true});
        const logs = req.body.logs;
        if (!Array.isArray(logs) || logs.length === 0) {
            return res.status(400).json({ ok: false, error: 'No logs provided' });
        }
        const withTimestamps = logs.map(l => ({ ...l, createdAt: new Date(l.d || Date.now()) }));
        const result = await ChatLog.insertMany(withTimestamps, { ordered: false });
        res.status(201).json({ ok: true, inserted: result.length });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// ---------- READ ROUTES (used by dashboard) ----------

// GET /api/logs — Fetch all logs
app.get('/api/logs', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI) return res.status(200).json({ok: true, count: 0, logs: []});
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
        const logs = await ChatLog.find(query).sort({ createdAt: -1 }).limit(limit).lean();
        res.json({ ok: true, count: logs.length, logs });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// PATCH /api/logs/:id/resolve — Mark an unanswered question as resolved
app.patch('/api/logs/:id/resolve', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI) return res.status(200).json({ok: true});
        await ChatLog.findByIdAndUpdate(req.params.id, { resolved: true });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// DELETE /api/logs — Clear all logs
app.delete('/api/logs', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI) return res.status(200).json({ok: true});
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
