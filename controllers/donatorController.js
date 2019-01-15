'use strict';

var express = require('express');
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')

app.use(cors())
router.use(cors())


// support on x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(function (req, res, next) { });


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

/* ### view_donator ## */
exports.viewInfo = function (req, res) {
  console.log("hit",req.query.id);
  let donatorSearchQuery = "\
                      SELECT *\
                      FROM donator d\
                      WHERE d.Donor_ID='" + req.query.id + "' OR d.First_Name LIKE '%"+req.query.id+"%' ";
  db.query(donatorSearchQuery, (err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result[0]) {
        return res.status(200).json({
          donatorDetails: result[0],
          message: "Data Received",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          memberDetails: "Empty",
          message: "No data found",
          isSuccess: false
        });
      }
    }
  });
}

/* ### Register_donator ## */
exports.registerDonator = function (req, res) {
  console.log(req.body);
  let addDonatorQuery = "\
                          INSERT INTO donator\
                         (First_Name, Address, Email, Mobile, Last_Name, NIC, Title)\
                          VALUES(\
                          '" + req.body.supplier.d_fname + "',\
                          '" + req.body.supplier.d_address + "',\
                          '" + req.body.supplier.d_email + "',\
                          '" + req.body.supplier.d_mobile + "',\
                          '" + req.body.supplier.d_lname + "',\
                          '" + req.body.supplier.d_nic + "',\
                          '" + req.body.supplier.d_title + "'\
                        )";
  db.query(addDonatorQuery, (err, result) => {
    if (err)
      return res.status(200).json({
         message: "Failed",
         isSuccess: false
        });
    else {
      if (result.affectedRows > 0) {
        return res.status(200).json({
          response: "Donator Registered Successfully",
          message: "Donator Registered Successfully",
          isSuccess: true
        });

      }
    }
  });
}

/* ### update_donator ## */
exports.updateDonator = function (req, res) {
  let updateDonatorQuery = "UPDATE donator\
                     SET\
                      First_Name='" + req.body.First_Name + "',\
                      Address='" + req.body.Address + "',\
                      Email='" + req.body.Email + "',\
                      Mobile='" + req.body.Mobile + "',\
                      Title='" + req.body.Title + "',\
                      NIC='" + req.body.NIC + "',\
                      Last_Name='" + req.body.Last_Name + "'\
                      WHERE Donor_ID='"+ req.body.Donor_ID + "' ";
  db.query(updateDonatorQuery, (err, result) => {
    if (err)
      return res.status(200).json({ 
        message: "Update Failed",
        isSuccess: false
      });
    else {
      if (result.affectedRows > 0) {
        return res.status(200).json({
          message: result.affectedRows + " " + "Record/s Updated",
          isSuccess: true
        });
      }
    }
  });
}

/* ### get_NIC_list ## */
exports.getIDList = function (req, res) {
  let nicSearchQuery = "\
                      SELECT NIC\
                      FROM donator ";
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

/* ### get_DonatorList ## */
exports.getDonatorList= function (req, res) {
  let donatorSearchQuery = "\
                      SELECT Donor_ID,First_Name\
                      FROM donator ";
  db.query(donatorSearchQuery, (err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result[0]) {
        return res.status(200).json({
          donatorList: result,
          message: "Data Received",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          donatorList: "Empty",
          message: "No data found",
          isSuccess: false
        });
      }
    }
  });
}