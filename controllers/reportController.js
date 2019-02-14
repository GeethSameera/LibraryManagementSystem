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


/* ### get_PublisherList ## */
exports.getMemberList= function (req, res) {
  let memberSearchQuery = "\
                      SELECT \
                      m.Member_ID,CONCAT(Title,' ',FName,' ',LName)AS Name,Member_Type, NIC,Gender,CONCAT_WS(', ',ma.M_Postal_Code,ma.M_Street,ma.M_City) AS Address,Mobile, Registration_Date, Expire_Date\
                      FROM member m,member_address ma\
                      WHERE m.Member_ID=ma.Member_ID AND Registration_Date BETWEEN '"+req.query.fromDate+"'AND '"+req.query.toDate+"' ";
  db.query(memberSearchQuery, (err, result) => {
    if (err)
      return res.status(200).json({ message: err });
    else {
      if (result[0]) {
        return res.status(200).json({
          memberList: result,
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

/* ### get_History ## */
exports.getReservationHistory = function (req, res) {
  let searchHistoryQuery = "\
                      SELECT m.Member_ID,b.ISBN,b.Book_Name,GROUP_CONCAT(DISTINCT a.Name SEPARATOR ', ') as Name,b.Edition,br.Reserve_Date,br.Expire_Date\
                      FROM book_reservation br,member m,book b,book_author ba,author a \
                      WHERE br.Member_ID=m.Member_ID AND br.Book_ID=b.Book_ID AND b.Book_ID=ba.Book_ID AND ba.Author_ID=a.Author_ID AND \
                      br.Reserve_Date BETWEEN '"+req.query.fromDate+"'AND '"+req.query.toDate+"' GROUP BY b.Book_ID ";
  db.query(searchHistoryQuery, (err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result[0]) {
        return res.status(200).json({
          reservationList: result,
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

/* ### get_Payments ## */
exports.getPaymentsHistory = function (req, res) {
  let searchHistoryQuery = "\
                      SELECT Payment_ID, Description, Date, Amount\
                      FROM payment\
                      WHERE Member_ID='"+req.query.id+"' AND Date BETWEEN '"+req.query.fromDate+"'AND '"+req.query.toDate+"' ";
  db.query(searchHistoryQuery, (err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result[0]) {
        return res.status(200).json({
          paymentsList: result,
          message: "Data Received",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          paymentsList: "Empty",
          message: "No data found",
          isSuccess: false
        });
      }
    }
  });
}

/* ### get_Status ## */
exports.getProgressHistory = function (req, res) {
  let searchHistoryQuery = "\
  SELECT \
  (SELECT COUNT(Book_ID) FROM `book` WHERE Date BETWEEN '"+req.query.fromDate+"' AND '"+req.query.toDate+"') as Book_Count, \
  (SELECT COUNT(Book_ID) FROM `book_borrow` WHERE Borrow_Date BETWEEN '"+req.query.fromDate+"' AND '"+req.query.toDate+"') as Issued_Book_Count,\
  (SELECT SUM(Amount) FROM `payment` WHERE Date BETWEEN '"+req.query.fromDate+"' AND '"+req.query.toDate+"') as Total_Levy,\
  (SELECT COUNT(Member_ID) FROM `member` WHERE Registration_Date BETWEEN '"+req.query.fromDate+"' AND '"+req.query.toDate+"' AND Member_Type='Student') as Student_Member_Count,\
  (SELECT COUNT(Member_ID) FROM `member` WHERE Registration_Date BETWEEN '"+req.query.fromDate+"' AND '"+req.query.toDate+"' AND Member_Type='Adult') as Adult_Member_Count ";
  db.query(searchHistoryQuery, (err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result[0]) {
        return res.status(200).json({
          progress: result,
          message: "Data Received",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          progress: "Empty",
          message: "No data found",
          isSuccess: false
        });
      }
    }
  });
}

/* ### get_availability ## */
exports.getAvailabilityHistory = function (req, res) {
  let searchHistoryQuery = "\
                      SELECT b.Book_ID,b.ISBN,b.Book_Name,CONCAT(m.FName,' ',m.LName)AS Name,bb.Borrow_Date,bb.Return_Date\
                      FROM book_borrow bb,member m,book b\
                      WHERE bb.Book_ID=b.Book_ID AND bb.Member_ID=m.Member_ID AND\
                      bb.Return_Date BETWEEN '"+req.query.fromDate+"'AND '"+req.query.toDate+"' AND bb.Return_Status='Pending' ";
  db.query(searchHistoryQuery, (err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result[0]) {
        return res.status(200).json({
          availabilityList: result,
          message: "Data Received",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          availabilityList: "Empty",
          message: "No data found",
          isSuccess: false
        });
      }
    }
  });
}

/* ### get_dashboard data ## */
exports.getDashboardData = function (req, res) {
  let getDonutGraphData = "\
                      SELECT bc.Name,b.No_of_copies \
                      FROM book b,book_category bc\
                      WHERE b.Category=bc.Category_ID\
                      GROUP BY bc.Name";

  let getTileData="SELECT \
                    (SELECT COUNT(Member_ID) FROM member WHERE Expire_Date > NOW()) AS Active_Members,\
                    (SELECT COUNT(Available_copies) FROM book) AS Available_Books,\
                    (SELECT COUNT(No_of_copies) FROM book) AS Total_Books,\
                    (SELECT COUNT(Donor_ID) FROM donator) AS Donators\
                    ;"   

  let getBarGraphDate="SELECT\
                      ( SELECT CONCAT(SUBSTR(MONTHNAME(DATE_SUB(NOW(), INTERVAL 1 MONTH)),1,3),YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH)),'-',CAST(COUNT(Member_ID) AS CHAR))\
                      FROM member\
                      WHERE Registration_Date BETWEEN  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01') AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 0 MONTH), '%Y-%m-01'))\
                      AS sixth,\
                      ( SELECT CONCAT(SUBSTR(MONTHNAME(DATE_SUB(NOW(), INTERVAL 2 MONTH)),1,3),YEAR(DATE_SUB(NOW(), INTERVAL 2 MONTH)),'-',CAST(COUNT(Member_ID) AS CHAR))\
                      FROM member\
                      WHERE Registration_Date BETWEEN  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 2 MONTH), '%Y-%m-01') AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01'))\
                      AS fifth,\
                      ( SELECT CONCAT(SUBSTR(MONTHNAME(DATE_SUB(NOW(), INTERVAL 3 MONTH)),1,3),YEAR(DATE_SUB(NOW(), INTERVAL 3 MONTH)),'-',CAST(COUNT(Member_ID) AS CHAR))\
                      FROM member\
                      WHERE Registration_Date BETWEEN  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 3 MONTH), '%Y-%m-01') AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 2 MONTH), '%Y-%m-01'))\
                      AS fourth,\
                      ( SELECT CONCAT(SUBSTR(MONTHNAME(DATE_SUB(NOW(), INTERVAL 4 MONTH)),1,3),YEAR(DATE_SUB(NOW(), INTERVAL 4 MONTH)),'-',CAST(COUNT(Member_ID) AS CHAR))\
                      FROM member\
                      WHERE Registration_Date BETWEEN  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 4 MONTH), '%Y-%m-01') AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 3 MONTH), '%Y-%m-01'))\
                      AS third,\
                      ( SELECT CONCAT(SUBSTR(MONTHNAME(DATE_SUB(NOW(), INTERVAL 5 MONTH)),1,3),YEAR(DATE_SUB(NOW(), INTERVAL 5 MONTH)),'-',CAST(COUNT(Member_ID) AS CHAR))\
                      FROM member\
                      WHERE Registration_Date BETWEEN  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 5 MONTH), '%Y-%m-01') AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 4 MONTH), '%Y-%m-01'))\
                      AS second,\
                      ( SELECT CONCAT(SUBSTR(MONTHNAME(DATE_SUB(NOW(), INTERVAL 6 MONTH)),1,3),YEAR(DATE_SUB(NOW(), INTERVAL 6 MONTH)),'-',CAST(COUNT(Member_ID) AS CHAR))\
                      FROM member\
                      WHERE Registration_Date BETWEEN  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 6 MONTH), '%Y-%m-01') AND DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 5 MONTH), '%Y-%m-01'))\
                      AS first\
                      ;"        

  let donutGraphData;
  let tileData;
  let barGraphData;                  
  db.query(getDonutGraphData, (err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result[0]) {
        donutGraphData=result;
        db.query(getTileData, (err, result) => {
          if (err)
            return res.status(500).json({ message: err });
          else {
            if (result[0]) {
              tileData=result;
              db.query(getBarGraphDate, (err, result) => {
                if (err)
                  return res.status(500).json({ message: err });
                else {
                  if (result[0]) {
                    barGraphData=result;
                    // console.log(typeof(barGraphData));
                    return res.status(200).json({
                      dashboardData: {
                        donutData:donutGraphData,
                        tiles:tileData,
                        barData:barGraphData
                      },
                      message: "Data Received",
                      isSuccess: true
                    });
                  }
                  else {
                    return res.status(200).json({
                      dashboardData: "Empty",
                      message: "No data found",
                      isSuccess: false
                    });
                  }
                }
              });
            }
            else {
              return res.status(200).json({
                dashboardData: "Empty",
                message: "No data found",
                isSuccess: false
              });
            }
          }
        });

      }
      else {
        return res.status(200).json({
          dashboardData: "Empty",
          message: "No data found",
          isSuccess: false
        });
      }
    }
  });
}
