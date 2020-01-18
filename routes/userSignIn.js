const express = require('express');
const router = express.Router();
const User = require('../models/user');
const state = require('./_globals');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
    if (state.user == null) {
        //user is not there then login him on /login
        res.render('userAction', {
            userAction: 'Login',
            user: new User(),
            signedIn: state.signedIn //for header links
        });
    } else {
        res.redirect('/');
    }
});

function logout_delete_get(req, res, action) {
    const errorMsg = req.app.get('errorMsg');
    if (state.user != null) {
        //user is there then logout or delete him on /logout or /delete
        res.render('userAction', {
            userAction: action,
            errorMsg: errorMsg || null,
            user: state.user,
            signedIn: state.signedIn //for header links
        });
    } else {
        res.redirect('/user/login');
    }
}

router.get('/logout', (req, res) => {
    logout_delete_get(req, res, 'Logout');
});

router.get('/delete', (req, res) => {
    logout_delete_get(req, res, 'Delete');
});

router.get('/signup', (req, res) => {
    let user = {};
    if (state.user == null) {
        user = new User();
        res.render('userAction', {
            userAction: 'Sign Up',
            user,
            signedIn: state.signedIn //for header links
        });
    } else {
        res.redirect('/');
    }
});

router.post('/signup', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    try {
        await newUser.save();
        state.signedIn = true;
        state.user = req.body;
        res.redirect('/');
    } catch {
        res.render('userAction', {
            userAction: 'Sign Up',
            user: newUser,
            signedIn: state.signedIn,
            errorMsg: 'Error Signing Up'
        });
    }
});

router.post('/login', async (req, res) => {
    let user = {};
    user = req.body;
    try {
        let userfound = await User.findOne({ email: user.email });
        if (userfound != null && await userfound.passwordIsValid(user.password)) {
            state.signedIn = true;
            state.user = userfound;
            res.redirect('/');
        } else {
            throw 'User not found';
        }
    } catch {
        res.render('userAction', {
            userAction: 'Login',
            user,
            signedIn: state.signedIn,
            errorMsg: 'User not found'
        });
    }
});

function check_logout_delete_details(req, res, action) {
    try {
        if (state.user) {
            const email = state.user.email;
            const password = state.user.password;
            const email1 = req.body.email;
            const guessedPassword = req.body.password;

            //here password is encrypted in state.user and guessedPassword is not encrypted
            bcrypt.compare(guessedPassword, password, async (err, isMatch) => {
                if (err || !isMatch || email != email1) {
                    throw 'User details not matched';
                }
                else if (email === email1) {
                    if (action === 'delete') {
                        try {
                            let user = await User.findOne({ email: email });
                            user.remove();
                        } catch{
                            throw 'Error happened, Cannot delete';
                        }
                    }
                    state.signedIn = false;
                    state.user = null;
                    res.redirect('/');
                }
            });
        } else {
            throw 'Error happened, Cannot ' + action;
        }
    } catch (err) {
        req.app.set('errorMsg', err);
        res.redirect('/user/' + action);
    }
}

router.post('/logout', (req, res) => {
    check_logout_delete_details(req, res, 'logout');
});

router.post('/delete', (req, res) => {
    check_logout_delete_details(req, res, 'delete');
});

//page not found
router.get('/*', (req, res) => {
    res.render('404');
});

module.exports = router;