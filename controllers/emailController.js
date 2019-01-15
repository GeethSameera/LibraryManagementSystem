'use strict';
const nodemailer = require('nodemailer');
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

exports.sendEmail = function (req, res) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'pannalalibrary@yahoo.com', // generated ethereal user
          pass: '12345#asd' // generated ethereal password
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
    logger: true,
    debug: true
      
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Pannala Libaray" <pannalalibrary@yahoo.com>', // sender address
      to: req.body.email, // list of receivers
      subject: req.body.subject, // Subject line
      text: req.body.message, // plain text body
      // html: '<b>Hello world?</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(200).json({
          emailStatus: "Failed",
          message: "Email Sending UnSuccessful",
          isSuccess: false
        });
      }
      else{
        return res.status(200).json({
          emailStatus: "Success",
          message: "Email Sending Successful",
          isSuccess: true
        });
      }
      // console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  });

}
