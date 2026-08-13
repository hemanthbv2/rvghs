const mongoose = require('mongoose');

const ChatLogSchema = new mongoose.Schema({
    s: { type: String, required: true }, // session_id
    q: { type: String, required: true }, // query
    i: { type: String, required: true }, // intent
    d: { type: String }, // timestamp string from frontend
    t: { type: String, default: 'message' }, // event_type
    m: { type: Object }, // metadata
    device: { type: String },
    deviceType: { type: String },
    browserName: { type: String },
    os: { type: String },
    city: { type: String },
    country: { type: String },
    resolved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: false, collection: 'rvghs' });

module.exports = mongoose.model('ChatLog', ChatLogSchema);
