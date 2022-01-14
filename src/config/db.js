const mongoose = require('mongoose');
require('dotenv').config();

const connect = () => {
    return mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@rhythm-house-main.kmw6l.mongodb.net/rhythmHouse`)
}

module.exports = connect;