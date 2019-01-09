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
exports.viewBookInfo = function (req, res) {
  let memberInsertionQuery = "\
                      SELECT\
                      b.Book_ID,\
                      b.ISBN,\
                      b.Book_Name,\
                      a.Name,\
                      b.No_of_copies,\
                      b.Edition,\
                      b.No_of_copies\
                      FROM book b,book_author ba,author a\
                      WHERE b.Book_ID=ba.Book_ID AND ba.Author_ID=a.Author_ID AND (b.Book_Name LIKE '%"+ req.query.id + "%' OR b.ISBN='" + req.query.id + "' OR a.Name LIKE '%" + req.query.id + "%') ";
  db.query(memberInsertionQuery, (err, result) => {
    if (err)
      return res.status(500).json({ message: result });
    else {
      if (result[0]) {
        return res.status(200).json({
          bookDetails: result,
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

/* ### Register_category ## */
exports.addCategory = function (req, res) {
  console.log(req.body);
  let addCategoryQuery = "\
                          INSERT INTO book_category\
                         (Name)\
                          VALUES(\
                          '" + req.body.category.name + "'\
                        )";
  db.query(addCategoryQuery, (err, result) => {
    if (err)
      return res.status(200).json({
         message: err,
         isSuccess: false
        });
    else {
      if (result.affectedRows > 0) {
        return res.status(200).json({
          response: "Category Added Successfully",
          message: "Category Added Successfully",
          isSuccess: true
        });

      }
    }
  });
}


/* ### get_BookCategoryList ## */
exports.getBookCategoryList= function (req, res) {
  let bookCategorySearchQuery = "\
                      SELECT Category_ID,Name\
                      FROM book_category ";
  db.query(bookCategorySearchQuery, (err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result[0]) {
        return res.status(200).json({
          categoryList: result,
          message: "Data Received",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          categoryList: "Empty",
          message: "No data found",
          isSuccess: false
        });
      }
    }
  });
}