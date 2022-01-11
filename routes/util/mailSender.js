const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
//although it's shown that it's not used but without this module, the authentication cannot be done here
//xoauth2 is required in the background
const state = require('../_globals');

const sendMail = (purpose = 'verify', msg = '') => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'gouravkhator9@gmail.com',
            clientId: process.env.MAIL_CLIENT_ID,
            clientSecret: process.env.MAIL_CLIENT_SECRET,
            refreshToken: process.env.MAIL_REFRESH_TOKEN,
            accessToken: process.env.MAIL_ACCESS_TOKEN,
        }
    });
    if (purpose === 'verify') {
        let otp = Math.floor(100000 + Math.random() * 900000);
        //as Math.random gives number between 0 and 1 inclusive of 0 but not 1 so 6-digit will only be there

        let mailOptions = {
            from: 'Ebooks-go-app <gouravkhator9@gmail.com',
            to: state.tempUser.email,
            subject: 'Verification Email',
            html: `<h2>Your OTP is ${otp}.</h2><br> <h3>Enter this otp in the verification page.<h3> <h3>Please don't share with anyone.</h3>`
        };

        let temp = true;
        transporter.sendMail(mailOptions, (err, res) => {
            if (err) {
                temp = false;
            }
        });
        if (temp === false) {
            return {
                mailSent: false
            };
        } else {
            return {
                mailSent: true,
                otp
            };
        }
    } else {
        let mailOptions = {
            from: 'Ebooks-go-app <gouravkhator9@gmail.com',
            to: state.user.email,
            subject: 'Purchase Email',
            html: `<h2>${msg}</h2>`
        };
        transporter.sendMail(mailOptions);
    }
}

module.exports = sendMail;