const mongoose = require('mongoose');

const fishingLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    entries: [{ type: String }],
});

module.exports = mongoose.model('FishingLog', fishingLogSchema);
