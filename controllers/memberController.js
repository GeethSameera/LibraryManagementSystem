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
  let memberInsertionQuery = "\
                      SELECT *\
                      FROM member m,guarantor g,member_address ma\
                      WHERE m.Guarantor_ID=g.Guarantor_ID AND m.Member_ID=ma.Member_ID AND\
                      m.Member_ID='" + req.query.id + "' OR m.NIC='" + req.query.id + "'  ";
  db.query(memberInsertionQuery, (err, result) => {
    // console.log(req.query.userName)
    if (err) //throw err;
      return res.status(500).json({ message: result });
    // console.log(result,new Date().getTime());
    else {
      if (result[0]) {
        // console.log(result[0].userName);
        return res.status(200).json({
          // message:result[0],
          memberDetails: result[0],
          message: "Data Received",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          // message:result
          memberDetails: "Empty",
          message: "No data found",
          isSuccess: false
        });
      }
    }
  });
}

/* ### Register_member ## */
exports.registerMember = function (req, res) {
  console.log(req.body);
  let addMemberQuery = "\
                          INSERT INTO member\
                          VALUES(\
                            9,\
                            '" + req.body.member.m_title + "',\
                            '" + req.body.member.m_firstName + "',\
                            '" + req.body.member.m_lastName + "',\
                            '" + req.body.member.m_gender + "',\
                            '" + req.body.member.m_dob + "',\
                            '" + req.body.member.m_expiryDate + "',\
                            '" + req.body.member.m_nic + "',\
                            '" + req.body.member.m_memberType + "',\
                            '" + req.body.member.m_mobile + "',\
                            '" + req.body.member.m_email + "',\
                            '" + req.body.member.m_expiryDate + "',\
                            13\
                          )";
  // console.log(addMemberQuery);
  let addGuarantorQuery = "\
                          INSERT INTO guarantor\
                          VALUES(\
                          14,\
                          '" + req.body.guarantor.g_title + "',\
                          '" + req.body.guarantor.g_firstName + "',\
                          '" + req.body.guarantor.g_nic + "',\
                          '" + req.body.guarantor.g_workplace + "',\
                          '" + req.body.guarantor.g_postalCode + "',\
                          '" + req.body.guarantor.g_street + "',\
                          '" + req.body.guarantor.g_city + "',\
                          '" + req.body.guarantor.g_occupation + "',\
                          '" + req.body.guarantor.g_mobile + "'\
                        )";
  db.query(addMemberQuery, (err, result) => {
    // console.log(req.query.userName)
    if (err)
      return res.status(500).json({ message: "Registration Failed" });
    else {
      if (result.affectedRows > 0) {
        db.query(addGuarantorQuery, (err, result) => {
          if (err)
            return res.status(500).json({ message: "Registration Failed" });
          else {
            if (result.affectedRows > 0) {
              return res.status(200).json({
                response: "Member Registered Successfully",
                message: "Member Registered Successfully",
                isSuccess: true
              });
            }
          }
        });

      }
      else {
        return res.status(200).json({
          response: "Registration Failed",
          message: "Registration Failed",
          isSuccess: false
        });
      }
    }
  });
}