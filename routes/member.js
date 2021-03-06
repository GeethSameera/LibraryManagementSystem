'use strict'

var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
// var Job  = require('../models/job');
var memberController  = require('../controllers/memberController');

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

router.get('/viewDetails',memberController.viewInfo);
router.post('/register',memberController.registerMember);
router.put('/update',memberController.updateMember);
router.get('/getniclist',memberController.getIDList);
router.get('/clearreservations',memberController.removeReservations);
router.get('/updatereservations',memberController.UpdateReservations);

module.exports = router;


