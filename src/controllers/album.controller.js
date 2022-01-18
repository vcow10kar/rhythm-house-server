const express = require('express');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

const Album = require('../models/album.model');

router.get('/', async (req, res) => {
    try {

        let queryGenres;
        const page = req.query.page || 1;
        const size = 8;

        if(req.query.genres) {
            queryGenres = req.query.genres.split(',');
        }

        const offset = (page - 1) * size;

        const albumsCount = await Album.find({}).countDocuments();
        const allAlbums = await Album.find({}).lean().exec();

        const genres = new Set();

        for(let i = 0; i < allAlbums.length; i++) {
            genres.add(allAlbums[i].genre);
        }

        queryGenres = queryGenres || [...genres];
        if (req.query.sort && queryGenres) {
            const count = await Album.find({genre: {$in: [...queryGenres]}}).countDocuments();

            const albums = await Album.find({genre: {$in: [...queryGenres]}}).populate('artist', "name").sort({ year: req.query.sort }).skip(offset).limit(size).lean().exec();

            let pages;

            if(queryGenres.length === genres.size) {
                pages = Math.ceil(albumsCount / size);
            } else {
                pages = Math.ceil(count / size);
            }

            //console.log('Pages 2', pages);

            return res.status(200).send({ albums: albums, albumsCount: albumsCount, pages: pages,  genres: [...genres] });
        } else if(queryGenres.length === genres.size) {
            const count = await Album.find({genre: {$in: [...queryGenres]}}).countDocuments();

            const albums = await Album.find({}).populate('artist', "name").skip(offset).limit(size).lean().exec();

            const pages = Math.ceil(count / size);

            //console.log('Pages', pages, albumsCount, size);
            return res.status(200).send({ albums: albums, albumsCount: albumsCount, pages: pages, genres: [...genres] });
        } else if (queryGenres){
            const count = await Album.find({genre: {$in: [...queryGenres]}}).countDocuments();

            const albums = await Album.find({genre: {$in: [...queryGenres]}}).populate('artist', "name").skip(offset).limit(size).lean().exec();

            const pages = Math.ceil(count / size);

            //console.log('Pages 1', pages);
            return res.status(200).send({ albums: albums, albumsCount: albumsCount, pages: pages, genres: [...genres] });
        } 

    } catch (err) {
        console.log("Error in Getting Albums:", err);
        return res.status(400).send({ error: "Something went wrong!" });
    }
})


router.get('/:id', async (req, res) => {
    try {
        const albums = await Album.find({ artist: req.params.id }).populate('artist', "name").lean().exec();

        return res.status(200).send({ albums: albums });
    } catch (err) {
        console.log("Error in Getting by Artist Id:", err);
        return res.status(400).send({ error: "Something went wrong!" });
    }
})

router.get('/:search/search', async (req, res) => {
    try {
        //console.log("Request:", req.query);
        const size = 8;

        const albums = await Album.find({ name: { $regex: req.query.s, $options: 'i' } }).populate('artist', 'name').lean().exec();

        const pages = Math.ceil(albums.length / size);

        return res.status(200).send({ albums: albums, pages: pages });

    } catch (err) {
        console.log('Error in Searching:', err);
        return res.status(400).send({ error: "Something went wrong!" });
    }
})

router.post('/', authenticate, async (req, res) => {
    try {
        const payload = {
            ...req.body,
            artist: req.artist.artist._id
        }

        const album = await Album.create(payload);

        return res.status(200).send({ album: album });
    } catch (err) {
        console.log("Error:", err);
        return res.status(400).send({ error: "Something went wrong!" });
    }
})

router.patch('/:id', authenticate, async(req, res) => {
    try {

        const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        return res.status(200).send({album: album});

    } catch(err) {
        console.log('Error:', err);

        return res.status(400).send({error: 'Something went wrong!'});
    }
})

router.delete('/:id', authenticate, async(req, res) => {
    try {
        const album = await Album.findByIdAndDelete(req.params.id);

        return res.status(200).send({album});

    }catch(err) {
        console.log('Error:', err);

        return res.status(400).send({error: 'Something went wrong!'});
    }
})

module.exports = router;