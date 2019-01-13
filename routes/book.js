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
router.post('/addbooks',bookController.addbook);
router.put('/update',bookController.updateBooks);
router.get('/getcategorylist',bookController.getBookCategoryList);
router.post('/addcategory',bookController.addCategory);
router.get('/viewhistory',bookController.getHistory);
router.post('/issuebooks',bookController.burrowBooks);
router.get('/increment',bookController.incrementBooks);
router.get('/decrement',bookController.decrementBooks);
router.get('/updatestatus',bookController.updateStatus);
router.post('/reservebooks',bookController.reserveBooks);
router.post('/pay',bookController.pay);

module.exports = router;


