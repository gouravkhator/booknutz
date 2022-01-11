const express = require('express');
const router = express.Router();
const state = require('./_globals');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

router.get('/show/:filename', (req, res) => {
    if (state.signedIn) {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            if (file && (file.contentType === 'image/jpeg' || file.contentType === 'image/png')) {
                //Read output to browser
                const title = file.metadata.title;
                const description = file.metadata.description;
                const book = {
                    title, description, filename: file.filename,
                    _id: file._id
                };
                res.render('bookDetails', {
                    book,
                    user: state.user,
                    signedIn: state.signedIn,
                    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY
                });
            } else {
                res.redirect('/');
            }
        });
    } else {
        req.app.set('errorMsg', 'Please Sign In');
        //setting errorMsg in req so that we access it from get request to '/'
        res.redirect('/');
    }
});

module.exports = router;