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
exports.addPublisher = function (req, res) {
  console.log(req.body);
  let addPublisherQuery = "\
                          INSERT INTO publisher\
                         (Name)\
                          VALUES(\
                          '" + req.body.publisher.name + "'\
                        )";
  db.query(addPublisherQuery, (err, result) => {
    if (err)
      return res.status(200).json({
         message: err,
         isSuccess: false
        });
    else {
      if (result.affectedRows > 0) {
        return res.status(200).json({
          response: "Publisher Added Successfully",
          message: "Publisher Added Successfully",
          isSuccess: true
        });

      }
    }
  });
}


/* ### get_PublisherList ## */
exports.getPublisherList= function (req, res) {
  let publisherSearchQuery = "\
                      SELECT Publisher_ID,Name\
                      FROM publisher ";
  db.query(publisherSearchQuery, (err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result[0]) {
        return res.status(200).json({
          publisherList: result,
          message: "Data Received",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          publisherList: "Empty",
          message: "No data found",
          isSuccess: false
        });
      }
    }
  });
}