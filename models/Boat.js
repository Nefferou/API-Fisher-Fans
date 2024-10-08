const mongoose = require('mongoose');

const boatSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: { type: [Number], index: '2dsphere' }, // Pour la bounding box
});

module.exports = mongoose.model('Boat', boatSchema);
