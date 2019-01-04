var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')

app.use(cors())
router.use(cors())


// support on x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(function (req, res, next) { });


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(router);

let transporter = nodemailer.createTransport({
  host: 'mail.yahoo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: 'pannalalibrary@yahoo.com', // generated ethereal user
      pass: '12345#asd' // generated ethereal password
  },
  tls:{
    rejectUnauthorized:false
  }
});

// setup email data with unicode symbols
let mailOptions = {
  from: '"Geeth" <pannalalibrary@yahoo.com>', // sender address
  to: 'geethsameera077@gmail.com', // list of receivers
  subject: 'Hello ✔', // Subject line
  text: 'Hello world?', // plain text body
  html: '<b>Hello world?</b>' // html body
};

exports.sendEmail = function (req, res) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error"+error);
    }
    console.log('Message sent');
    console.log('Preview URL');
  });
}
