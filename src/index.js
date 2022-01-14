const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors({origin: `${process.env.FRONTEND_URL}`, credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


const artistController = require('./controllers/artist.controller');


app.use('/artist', artistController);

module.exports = app;