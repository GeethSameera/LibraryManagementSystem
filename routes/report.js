'use strict'

var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var reportController  = require('../controllers/reportController');

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

router.get('/getmemberdetails',reportController.getMemberList);
router.get('/getreservationhistory',reportController.getReservationHistory);
router.get('/getpaymentshistory',reportController.getPaymentsHistory);
router.get('/getprogresshistory',reportController.getProgressHistory);
router.get('/getbookhistory',reportController.getAvailabilityHistory);
router.get('/getdashboarddata',reportController.getDashboardData);

module.exports = router;


