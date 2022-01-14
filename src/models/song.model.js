const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
    name: {type: String, required: true, trim: true},
    album: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'albums'},
    artist: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'artists'},
    duration: {
        minutes: {type: Number, required: true},
        seconds: {type: Number, required: true}
    }
}, {
    versionKey: false,
    timestamps: false
});

const Song = new mongoose.model('songs', songSchema);

module.exports = Song;