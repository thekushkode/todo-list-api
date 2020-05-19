const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const router = express.Router();

dotenv.config();
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USERNAME, // generated ethereal user
        pass: process.env.MAIL_PASSWORD,
    },
});

// GET /contact
router.get('/', (req, res) => {
    res.render('contact', {
        title: "Contact Me. Please. I'm lonely.",
        submitted: false,
    });
});

// POST /contact
router.post('/', (req, res) => {
    transporter.sendMail({
        from: process.env.MAIL_FROM, // sender address
        to: process.env.MAIL_TO, // list of receivers
        subject: `New contact from ${req.body.name}`, // Subject line
        html: `<b>Hello world?</b>
        <b>Email:</b> ${req.body.email}<br> 
        <b>Name:</b> ${req.body.name}<br>
        <b>Comment:</b> ${req.body.comment}<br>`,
    })
    .then((status) => {
        console.log(status);
        res.render('contact', {
            title: 'Thank You',
            submitted: true,
        });
    });
}); 0

module.exports = router;