'use strict';

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')

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

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database:"login"
  });

/* ### upload image for job ## */
exports.connect = function (req, res) {
    console.log('###########connect##############'); 
    let data;
    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM login", function (err, result, fields) {
          if (err) throw err;
          data={
            "usename":result[0].userName,
            "password":result[0].password  
            };
          console.log(data);
        });
      });
    return JSON.parse(data);
}





