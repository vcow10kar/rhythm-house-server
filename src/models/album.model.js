const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    genre: {type: String, required: true, trim: true},
    year: {type: String, required: true, trim: true, length: 4},
    artist: {type: mongoose.Schema.Types.ObjectId, required: true, trim: true, ref: 'artists'},
    coverURL: {type: String, trim: true}
}, {
    versionKey: false,
    timestamps: false
});

const Album = new mongoose.model('albums', albumSchema);

module.exports = Album;