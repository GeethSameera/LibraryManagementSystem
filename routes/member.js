// 'use strict'

// var express = require('express');
// var router = express.Router();
// var app = express();
// var bodyParser = require('body-parser');
// var cors = require('cors')
// var Job  = require('../models/job');
// var JobController  = require('../controllers/job');
// var UserController = require('../controllers/user');

// app.use(cors())
// router.use(cors())



// //support on x-www-form-urlencoded
// app.use(bodyParser.urlencoded({
//   extended: true
// }));

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// router.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// router.get('/getJobs',JobController.getJobs);
// router.post('/addJobs',UserController.loginRequired, JobController.addJobs);
// router.post('/jobimage/:imageid',JobController.uploadImage);

// module.exports = router;


