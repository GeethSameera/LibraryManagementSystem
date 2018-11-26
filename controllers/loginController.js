'use strict';


var express = require('express');
var router = express.Router();
var app = express();
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors')
var Job = require('../models/job');
var User = require('../models/user');
var SubCategoty = require('../models/subcategory');
var JobController = require('../controllers/job');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var cryptoHandler = ('../controllers/cryptoHandler');
var user = require('../controllers/user');

var notification = require('./notification');
var imageUplo = require('./imageUpload');

app.use(cors())
router.use(cors())

app.use(fileUpload());

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
exports.uploadImage = function (req, res) {
  console.log(req);
  imageUplo.uploadImage(req, res, Job, 'jobimages');
}


/* ### get jobs ### */
/* ### route: /getJobs ### */
exports.getJobs = function (req, res) {
  Job.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "subCatId",
        foreignField: "_id",
        as: "subcategory"
      }
    }
  ])
    //Job.find({})
    .exec(function (err, jobs) {
      //console.log(user.findUserById("5bc89f0d80e1fa5f3b5b0429"));
      if (err) {
        console.log('####### error occured' + err);
        res.send('error');
      } else {
        if (jobs !== null) {
          res.json({ message: 'successfully get jobs', content: jobs });
        } else {
          res.json({ message: 'failed', details: "No jobs are found" });
        }
      }
    });
};

/* ### add jobs ### */
/* ### route: /addJobs ### */
exports.addJobs = function (req, res) {
  if (req.files && req.body) {
    let address = {
      'city': req.body.city,
      'street': req.body.street,
      'houseNumber': req.body.houseNumber
    }

    console.log("###### add Jobs ######");
    var job = new Job();
    job.userId = req.body.userId;
    job.categoryId = req.body.categoryId;
    job.subCatId = req.body.subCatId;
    job.description = req.body.description;
    job.dueDate = req.body.dueDate;
    job.dueTime = req.body.dueTime;
    job.priceLimit = req.body.priceLimit;
    job.longitude = req.body.longitude;
    job.latitude = req.body.latitude;
    job.address = address;

    User.findById(job.userId)
    .exec(function(err, user) {
      if (err) {
          return res.status(500).json({message: 'internel server error'});
      } else {
        if (user !== null) {
          SubCategoty.findOne({$and:[{'_id': job.subCatId},{'categoryId': job.categoryId}]})
          .exec(function(err, sub) {
            if (err) {
              return res.status(500).json({message: 'internel server error'});
            } else {
              if (sub !== null) {
                job.save(function (err) {
                  if (err) {
                    console.log('#################### error occured when adding job #######################');
                    console.log(err);
                    res.send(err);
                  } else {
                    notification.notifyToServer(job);
                    imageUplo.uploadImage(req, Job, 'jobimages', job._id);
                    res.json({ message: 'success', details: "Added job successfully", content: job });
                  }
                });
              } else {
                return res.status(404).json({message: 'subcategory not found'});
              }
            }
          })
        } else {
          return res.status(404).json({message: 'user not found'});
        }
      }
    });
    
  } else {
    res.status(400).json({message: 'no image or body'})
  }
};
