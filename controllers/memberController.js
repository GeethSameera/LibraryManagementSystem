'use strict';

var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')
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
  // console.log("req.body"); // populated!
  // console.log(req.body); // populated!
  // console.log("req.body"); // populated!
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
    if (err) 
      return res.status(500).json({ message: "Failed" });
    else {
      if (result[0]) {
        return res.status(200).json({
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
  // console.log(addMemberQuery);
  let addGuarantorQuery = "\
                          INSERT INTO guarantor\
                         (G_Title, G_Name, G_NIC, G_Workplace, G_Postal_Code, G_Street, G_City, G_Occupation, G_Mobile)\
                          VALUES(\
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
  db.query(addGuarantorQuery, (err, result) => {
    // console.log(req.query.userName)
    if (err)
      return res.status(200).json({ 
        message: "Registration Failed",
        isSuccess: false
      });
    else {
      if (result.affectedRows > 0) {
        let addMemberQuery = "\
        INSERT INTO member\
        (Title, FName, LName, Gender, DOB, Registration_Date, NIC, Member_Type, Mobile, Email, Expire_Date, Guarantor_ID)\
        VALUES(\
          '" + req.body.member.m_title + "',\
          '" + req.body.member.m_firstName + "',\
          '" + req.body.member.m_lastName + "',\
          '" + req.body.member.m_gender + "',\
          '" + req.body.member.m_dob + "',\
          '" + req.body.member.m_registerDate + "',\
          '" + req.body.member.m_nic + "',\
          '" + req.body.member.m_memberType + "',\
          '" + req.body.member.m_mobile + "',\
          '" + req.body.member.m_email + "',\
          '" + req.body.member.m_expiryDate + "',\
          '"+ result.insertId + "'\
        )";
        db.query(addMemberQuery, (err, result_m) => {
          if (err)
            return res.status(200).json({
               message: "Registration Failed",
               isSuccess: false
               });
          else {
            let memberAddressQuery = "\
            INSERT INTO member_address\
            VALUES(\
              '" + result_m.insertId + "',\
              '" + req.body.member.m_postalCode + "',\
              '" + req.body.member.m_street + "',\
              '" + req.body.member.m_city + "'\
            )";
            db.query(memberAddressQuery, (err, result) => {
              if (err)
                return res.status(200).json({
                   message: "Registration Failed",
                   isSuccess: false
               });
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

/* ### update_member ## */
exports.updateMember = function (req, res) {
  let updateMemberQuery = "\
                      UPDATE member\
                      SET\
                      Title='" + req.body.Title + "',\
                      FName='" + req.body.FName + "',\
                      LName='" + req.body.LName + "',\
                      Gender='" + req.body.Gender + "',\
                      DOB='" + req.body.DOB + "',\
                      Registration_Date='" + req.body.Registration_Date + "',\
                      NIC='" + req.body.NIC + "',\
                      Member_Type='" + req.body.Member_Type + "',\
                      Mobile='" + req.body.Mobile + "',\
                      Email='" + req.body.Email + "',\
                      Expire_Date='" + req.body.Expire_Date + "',\
                      Guarantor_ID='" + req.body.Guarantor_ID + "'\
                      WHERE Member_ID='"+ req.body.Member_ID + "' ";
  let updateGuaranterQuery = "UPDATE guarantor\
                     SET\
                      G_Title='" + req.body.G_Title + "',\
                      G_Name='" + req.body.G_Name + "',\
                      G_NIC='" + req.body.G_NIC + "',\
                      G_Workplace='" + req.body.G_Workplace + "',\
                      G_Postal_Code='" + req.body.G_Postal_Code + "',\
                      G_Street='" + req.body.G_Street + "',\
                      G_City='" + req.body.G_City + "',\
                      G_Occupation='" + req.body.G_Occupation + "',\
                      G_Mobile='" + req.body.G_Mobile + "'\
                      WHERE Guarantor_ID='"+ req.body.Guarantor_ID + "' ";
  db.query(updateMemberQuery, (err, result) => {
    if (err) 
      return res.status(500).json({ message: "Member Update Failed" });
    else {
      if (result.affectedRows > 0) {
        db.query(updateGuaranterQuery, (err, result) => {
          if (err) 
            return res.status(500).json({ message: err });
          else {
            if (result.affectedRows > 0) {
              return res.status(200).json({
                message: result.affectedRows + " " + "Record/s Updated",
                isSuccess: true
              });
            }
            else{
              return res.status(200).json({
                message: "Member Update Failed",
                isSuccess: false
              });
            }
          }
        });
      }
      else {
        return res.status(200).json({
          message: "Member Update Failed",
          isSuccess: false
        });
      }
    }
  });
}

/* ### get_NIC_list ## */
exports.getIDList = function (req, res) {
  let nicSearchQuery = "\
                      SELECT NIC\
                      FROM member ";
  db.query(nicSearchQuery, (err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result[0]) {
        return res.status(200).json({
          nicList: result,
          message: "Data Received",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          nicList: "Empty",
          message: "No data found",
          isSuccess: false
        });
      }
    }
  });
}