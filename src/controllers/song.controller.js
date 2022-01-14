const express = require('express');
const authenticate = require('../middlewares/authenticate');
const Song = require('../models/song.model');
const router = express.Router();

router.get('/', async(req, res) => {
    try {

        const songs = await Song.find({}).lean().exec();

        return res.status(200).send({songs: songs});

    } catch(err) {
        console.log('Error:', err);

        return res.status(400).send({error: "Something went wrong!"});
    }
})

router.get('/album/:id', async(req, res) => {
    try {

        const songs = await Song.find({album: req.params.id})
        .populate('album')
        .populate('artist', 'name')
        .lean().exec();

        return res.status(200).send({songs: songs});

    } catch(err) {
        console.log('Error:', err);

        return res.status(400).send({error: "Something went wrong!"});
    }
})

router.post('/', authenticate, async(req, res) => {
    try {

        const payload  = {
            ...req.body,
            artist: req.artist.artist._id
        }

        const song = await Song.create(payload);

        return res.status(200).send({song: song});

    } catch(err) {
        console.log('Error:', err);
        return res.status(400).send({error: 'Something went wrong!'});
    }
})

module.exports = router;