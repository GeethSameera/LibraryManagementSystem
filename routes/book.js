'use strict'

var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
var bookController  = require('../controllers/bookController');

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

router.get('/viewDetails',bookController.viewBookInfo);
// router.post('/register',memberController.registerMember);
// router.put('/update',memberController.updateMember);

module.exports = router;


