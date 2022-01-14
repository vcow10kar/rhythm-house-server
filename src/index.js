const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors({origin: `${process.env.FRONTEND_URL}`, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


const artistController = require('./controllers/artist.controller');
const albumController = require('./controllers/album.controller');
const songController = require('./controllers/song.controller');

app.use('/artist', artistController);
app.use('/album', albumController);
app.use('/song', songController);

module.exports = app;