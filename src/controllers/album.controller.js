const express = require('express');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

const Album = require('../models/album.model');

router.get('/', async (req, res) => {
    try {
        const albums = await Album.find({}).populate('artist', "name").lean().exec();

        return res.status(200).send({ albums: albums });
    } catch (err) {
        console.log("Error:", err);
        return res.status(400).send({ error: "Something went wrong!" });
    }
})


router.get('/:id', async (req, res) => {
    try {
        const albums = await Album.find({artist: req.params.id}).populate('artist', "name").lean().exec();

        return res.status(200).send({ albums: albums });
    } catch (err) {
        console.log("Error:", err);
        return res.status(400).send({ error: "Something went wrong!" });
    }
})

router.get('/search', async (req, res) => {
    try {
        const albums = await Album.find({ name: { $regex: req.query.search, $options: 'i' } }).lean().exec();

        return res.status(200).send({ albums: albums });
        
    } catch (err) {
        console.log('Error:', err);
        return res.status(400).send({ error: "Something went wrong!" });
    }
})

router.post('/', authenticate, async (req, res) => {
    try {
        const payload = {
            ...req.body,
            artist: req.artist.artist._id
        }

        console.log('Payload', payload);

        const album = await Album.create(payload).populate('artist', 'name');

        return res.status(200).send({ album: album });
    } catch (err) {
        console.log("Error:", err);
        return res.status(400).send({ error: "Something went wrong!" });
    }
})

module.exports = router;