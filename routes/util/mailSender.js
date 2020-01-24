const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
//although its showing that its not used but without this module, the authentication cannot be done here
//its required in background
const state = require('../_globals');

const sendMail = (purpose = 'verify', msg = '') => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'gouravkhator10@gmail.com',
            clientId: '536527255711-np41c27p6abo633kjgfti3uvnlii08e2.apps.googleusercontent.com',
            clientSecret: 'sf0BZoL7x6zdhoViLOj5JlBY',
            refreshToken: '1//04oiqz7TJZ_cRCgYIARAAGAQSNwF-L9Ir-4lw1zXx48VcU7-2zImuq89ng9ZnmFPaEAzMJSXFCktio2yhXSgiGx1wMzjxNuvCq5w',
            accessToken: 'ya29.Il-3Byw8oOFg9SgQLliKfc2dJzNX4tS8T9UnPxLGURvUDBLkC7bqQ60yg0dQ8BzN4K0nE4YwhkM14ELWn7CbMtk7RGll-XoHf30Ak_xabhLweGSax34jWJbYSTYeARG6BQ'
        }
    });
    if (purpose === 'verify') {
        let otp = Math.floor(100000 + Math.random() * 900000);
        //as Math.random gives number between 0 and 1 inclusive of 0 but not 1 so 6-digit will only be there

        let mailOptions = {
            from: 'Ebooks-go-app <gouravkhator10@gmail.com',
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
            from: 'Ebooks-go-app <gouravkhator10@gmail.com',
            to: state.user.email,
            subject: 'Purchase Email',
            html: `<h2>${msg}</h2>`
        };
        transporter.sendMail(mailOptions);
    }
}

module.exports = sendMail;