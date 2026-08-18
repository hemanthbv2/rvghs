const mongoose = require('mongoose');

const ChatLogSchema = new mongoose.Schema({
    s: { type: String, default: 'sid_anon' }, // session_id
    sessionId: { type: String },
    institute_id: { type: String, default: 'rvghs' },
    q: { type: String, default: '' }, // query text / label
    i: { type: String, default: '' }, // intent / elementId
    d: { type: String }, // timestamp string from frontend
    t: { type: String, default: 'message' }, // event_type (message, click, hover, copy, dwell, scroll)
    m: { type: Object, default: {} }, // metadata / payload data
    device: { type: String },
    deviceType: { type: String, default: 'Desktop' },
    browserName: { type: String },
    os: { type: String },
    city: { type: String },
    country: { type: String },
    resolved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: false, collection: 'rvghs', strict: false });

module.exports = mongoose.model('ChatLog', ChatLogSchema);
