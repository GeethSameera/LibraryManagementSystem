'use strict';


var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
var databaseController = require('./databaseController');
// var user = require('../controllers/user');

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

/* ### upload image for job ## */
exports.login = function (req, res) {
  console.log('#########################',req.body.userVM);
  //console.log(req);
   let message=databaseController.connect;
  return res.status(200).json({message: databaseController.connect()});
  // imageUplo.uploadImage(req, res, Job, 'jobimages');
}




/* ### add jobs ### */
/* ### route: /addJobs ### */
// exports.addJobs = function (req, res) {
//   if (req.files && req.body) {
//     let address = {
//       'city': req.body.city,
//       'street': req.body.street,
//       'houseNumber': req.body.houseNumber
//     }

//     console.log("###### add Jobs ######");
//     var job = new Job();
//     job.userId = req.body.userId;
//     job.categoryId = req.body.categoryId;
//     job.subCatId = req.body.subCatId;
//     job.description = req.body.description;
//     job.dueDate = req.body.dueDate;
//     job.dueTime = req.body.dueTime;
//     job.priceLimit = req.body.priceLimit;
//     job.longitude = req.body.longitude;
//     job.latitude = req.body.latitude;
//     job.address = address;

//     User.findById(job.userId)
//     .exec(function(err, user) {
//       if (err) {
//           return res.status(500).json({message: 'internel server error'});
//       } else {
//         if (user !== null) {
//           SubCategoty.findOne({$and:[{'_id': job.subCatId},{'categoryId': job.categoryId}]})
//           .exec(function(err, sub) {
//             if (err) {
//               return res.status(500).json({message: 'internel server error'});
//             } else {
//               if (sub !== null) {
//                 job.save(function (err) {
//                   if (err) {
//                     console.log('#################### error occured when adding job #######################');
//                     console.log(err);
//                     res.send(err);
//                   } else {
//                     notification.notifyToServer(job);
//                     imageUplo.uploadImage(req, Job, 'jobimages', job._id);
//                     res.json({ message: 'success', details: "Added job successfully", content: job });
//                   }
//                 });
//               } else {
//                 return res.status(404).json({message: 'subcategory not found'});
//               }
//             }
//           })
//         } else {
//           return res.status(404).json({message: 'user not found'});
//         }
//       }
//     });
    
//   } else {
//     res.status(400).json({message: 'no image or body'})
//   }
// };
