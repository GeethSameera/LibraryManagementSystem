'use strict'

var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var donatorController  = require('../controllers/donatorController');
var emailController = require ('../controllers/emailController');

app.use(cors())
router.use(cors())



//support on x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

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

router.get('/viewDetails',donatorController.viewInfo);
router.post('/register',donatorController.registerDonator);
router.put('/update',donatorController.updateDonator);
router.post('/sendletter',emailController.sendEmail);

module.exports = router;


