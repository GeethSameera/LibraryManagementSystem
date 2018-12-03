'use strict';

var express = require('express');
var router = express.Router();
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


/* ### upload image for job ## */
exports.getData = function (req, res) {
  console.log('###########connect##############'); 
  // let data="noData";
  // con.connect(function(err) {
  //     if (err) throw err;
  //     con.query("SELECT * FROM login", function (err, result, fields) {
  //       if (err) throw err;
  // return data;
  // else{
  //   data={
  //     "usename":result[0].name,
  //     "password":result[0].password  
  //   };
  // data=result;
  //   console.log("status of result object is ",data);
  //   console.log(data);
  //   return result[0].name ;
  // }
  //   });
  // });
  // return data;
  // console.log("before sending the return ",data)
  let usernameQuery = "SELECT * FROM login";
  db.query(usernameQuery, (err, result) => {
    if (err) {
      throw err;
    }
    console.log(result,new Date().getTime());
    return result;
  });
}

exports.test=function(req,res){
  return res.send({userName:"Geeth",password:"123"});
}

