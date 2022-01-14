const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const newToken = (artist) => {
    return jwt.sign({artist}, process.env.JWT_SECRET_KEY);
}

const {body, validationResult} = require('express-validator');

const Artist = require('../models/artist.model');

// create or register an artist
router.post('/register',
    body('name')
    .notEmpty()
    .withMessage("Artist's name is required!"),
    body('email')
    .notEmpty()
    .withMessage("Artist's email is required!")
    .isEmail()
    .withMessage('Enter a valid email!'),
    body('password')
    .notEmpty()
    .withMessage('Password is required!')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
    .withMessage('Invalid Password Format!')
    .isLength({min: 8})
    .withMessage('Password should be 8-20 characters long!'),

    async(req, res) => {
        const errors = validationResult(req);

        let  finalErrors = null;

        if(!errors.isEmpty()) {
            finalErrors = errors.array().map((error) => {
                return {
                    param: error.param,
                    message: error.msg
                };
            });

            return res.status(400).send({error:finalErrors});
        }

        try {
            const artistEmailCheck = await Artist.findOne({$or: [{email: req.body.email}, {username: req.body.username}]}).lean().exec();

            if(artistEmailCheck) {
                return res.status(400).send({error: "Artist with this Email or Username already exists!"});
            }

            const artist = await Artist.create(req.body);

            const token = newToken(artist);

            return res.status(201).send({token});

        } catch(err) {
            return res.status(400).send({error: "Something went wrong!"});
        }
    }
)

router.post('/login', async(req, res) => {
    try {
        const artist = await Artist.findOne({$or : [{email: {$eq: req.body.email}}, {username: {$eq: req.body.username}}]});

        if(!artist) {
            return res.status(400).send({error: 'Please check your Email Id or Username and password!'});
        }

        let match = artist.checkPassword(req.body.password);

        if(!match) {
            return res.status(400).send({error: 'Please check your Email Id or Username and password!'});
        }

        const token = newToken(artist);

        return res.status(200).send({token});

    } catch(err) {
        console.log(err);

        return res.status(400).send({error: 'Something went wrong!'});
    }
})



module.exports = router;