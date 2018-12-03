'use strict';

var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
var databaseController = require('./databaseController');
// var user = require('../controllers/user');
var Promise = require('promise');

var util = require('util');


app.use(cors())
router.use(cors())


// support on x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(function (req, res, next) {
  console.log("req.body"); // populated!
  console.log(req.body); // populated!
  console.log("req.body"); // populated!
});


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

/* ### view_member ## */
exports.viewInfo = function (req, res) {
  let usernameQuery = "SELECT * FROM login WHERE userName='" + req.query.userName+"' ";
  db.query(usernameQuery, (err, result) => {
    console.log(req.query.userName)
    if (err) //throw err;
      return res.status(500).json({ message:result });
    // console.log(result,new Date().getTime());
    else {
      if (result[0]) {
        console.log(result[0].userName);
        return res.status(200).json({
            message:result
        //   response: {
        //     userName: result[0].userName,
        //     password: result[0].password
        //   },
        //   message: "Logged in Successfully",
        //   isSuccess: true
        });
      }
      else {
        return res.status(200).json({
            message:result
        //   response: {
        //     userName: "",
        //     password: ""
        //   },
        //   message: "Login Failed.Check Your Credentials And Retry",
        //   isSuccess: false
        });
      }
    }
  });
}

/* ### Register_member ## */
exports.registerMember = function (req, res) {
    let usernameQuery = "INSERT INTO login VALUES('"+req.body.userName+"','"+req.body.password+"') ";
    db.query(usernameQuery, (err, result) => {
      console.log(req.query.userName)
      if (err) //throw err;
        return res.status(500).json({ message:result });
      // console.log(result,new Date().getTime());
      else {
        // if (result[0]) {
        //   console.log(result[0].userName);
          return res.status(200).json({
              message:"Member Registered Successfully"
          //   response: {
          //     userName: result[0].userName,
          //     password: result[0].password
          //   },
          //   message: "Logged in Successfully",
          //   isSuccess: true
          });
        // }
        // else {
        //   return res.status(200).json({
        //       message:result
        //   //   response: {
        //   //     userName: "",
        //   //     password: ""
        //   //   },
        //   //   message: "Login Failed.Check Your Credentials And Retry",
        //   //   isSuccess: false
        //   });
        // }
      }
    });
  }