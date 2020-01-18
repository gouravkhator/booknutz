const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const Grid = require('gridfs-stream');
const app = express();
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const mongoose = require('mongoose');
const state = require('./routes/_globals');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Connetion with db
let url = keys.mongoUri;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
    console.log('Connected');
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});
conn.on('error', (err) => console.log(err));

//Home Page
app.get('/', (req, res) => {
    const errorMsg = req.app.get('errorMsg');
    gfs.files.find({}).toArray((err, files) => {
        if (files) {
            res.render('index', {
                signedIn: state.signedIn,
                books: files,
                errorMsg: errorMsg ? errorMsg : null,
                stripePublishableKey: keys.stripePublishableKey
            });
            req.app.set('errorMsg', null);
        } else {
            res.render('index', {
                signedIn: state.signedIn,
                books: [],
                errorMsg: 'Cannot fetch ebooks',
                stripePublishableKey: keys.stripePublishableKey
            });
        }
    });
});

//Charge post request
app.post('/charge', (req, res) => {
    const amount = 50000;
    //First create customer then create charge then render success page
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    }).then(customer => {
        stripe.charges.create({
            amount,
            // description: 'Web Dev Ebook', //TODO: add description dynamically
            currency: 'INR',
            customer: customer.id,
        });
    }).then(charge => res.render('success',{ signedIn: state.signedIn }));
});

//user routes for sign in and sign out
app.use('/user', require('./routes/userSignIn'));
app.use('/book', require('./routes/book'));

//fetch image and its for purpose of easy development
app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file) {
            return res.status(404).json({
                err: 'No File exists'
            });
        }

        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            //Read output to browser
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res);
        }
    });
});

app.get('/*', (req, res) => {
    res.render('404');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
