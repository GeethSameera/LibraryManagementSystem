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


/* ### Register_donator ## */
exports.addAuthor = function (req, res) {
  console.log(req.body);
  let addAuthorQuery = "\
                          INSERT INTO author\
                         (Name)\
                          VALUES(\
                          '" + req.body.author.name + "'\
                        )";
  db.query(addAuthorQuery, (err, result) => {
    if (err)
      return res.status(200).json({
         message: "Failed",
         isSuccess: false
        });
    else {
      if (result.affectedRows > 0) {
        return res.status(200).json({
          response: "Author Added Successfully",
          message: "Author Added Successfully",
          isSuccess: true
        });

      }
    }
  });
}


/* ### get_AuthorList ## */
exports.getAuthorList= function (req, res) {
  let authorSearchQuery = "\
                      SELECT Author_ID,Name\
                      FROM author ";
  db.query(authorSearchQuery, (err, result) => {
    if (err)
      return res.status(200).json({ message: "Failed",isSuccess: false });
    else {
      if (result[0]) {
        return res.status(200).json({
          authorList: result,
          message: "Data Received",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          authorList: "Empty",
          message: "No data found",
          isSuccess: false
        });
      }
    }
  });
}