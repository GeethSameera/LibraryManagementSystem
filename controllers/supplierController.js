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

/* ### view_supplier ## */
exports.viewInfo = function (req, res) {
  console.log("hit",req.query.id);
  let supplierSearchQuery = "\
                      SELECT *\
                      FROM supplier s\
                      WHERE s.Supplier_ID='" + req.query.id + "' OR s.First_Name LIKE '%"+req.query.id+"%' ";
  db.query(supplierSearchQuery, (err, result) => {
    if (err)
      return res.status(500).json({ message: result });
    else {
      if (result[0]) {
        return res.status(200).json({
          supplierDetails: result[0],
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

/* ### Register_supplier ## */
exports.registerSupplier = function (req, res) {
  console.log(req.body);
  let addSupplierQuery = "\
                          INSERT INTO supplier\
                         (First_Name, Address, Email, Mobile, Designation, Company, Title, Last_Name)\
                          VALUES(\
                          '" + req.body.supplier.s_fname + "',\
                          '" + req.body.supplier.s_address + "',\
                          '" + req.body.supplier.s_email + "',\
                          '" + req.body.supplier.s_mobile + "',\
                          '" + req.body.supplier.s_designation + "',\
                          '" + req.body.supplier.s_company + "',\
                          '" + req.body.supplier.s_title + "',\
                          '" + req.body.supplier.s_lname + "'\
                        )";
  db.query(addSupplierQuery, (err, result) => {
    if (err)
      return res.status(200).json({
         message: "Failed",
         isSuccess: false
        });
    else {
      if (result.affectedRows > 0) {
        return res.status(200).json({
          response: "Supplier Registered Successfully",
          message: "Supplier Registered Successfully",
          isSuccess: true
        });

      }
    }
  });
}

/* ### update_member ## */
exports.updateSupplier = function (req, res) {
  let updateSupplierQuery = "UPDATE supplier\
                     SET\
                      First_Name='" + req.body.First_Name + "',\
                      Address='" + req.body.Address + "',\
                      Email='" + req.body.Email + "',\
                      Mobile='" + req.body.Mobile + "',\
                      Designation='" + req.body.Designation + "',\
                      Company='" + req.body.Company + "',\
                      Title='" + req.body.Title + "',\
                      Last_Name='" + req.body.Last_Name + "'\
                      WHERE Supplier_ID='"+ req.body.Supplier_ID + "' ";
  db.query(updateSupplierQuery, (err, result) => {
    if (err)
      return res.status(200).json({ 
        message: "Failed",
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

/* ### get_SuppplierList ## */
exports.getSupplierList= function (req, res) {
  let supplierSearchQuery = "\
                      SELECT Supplier_ID,First_Name\
                      FROM supplier ";
  db.query(supplierSearchQuery, (err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result[0]) {
        return res.status(200).json({
          supplierList: result,
          message: "Data Received",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          supplierList: "Empty",
          message: "No data found",
          isSuccess: false
        });
      }
    }
  });
}
