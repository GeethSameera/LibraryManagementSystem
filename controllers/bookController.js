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
                      GROUP_CONCAT(DISTINCT a.Author_ID) as Author_ID,\
                      GROUP_CONCAT(DISTINCT a.Name SEPARATOR ', ') as Name,\
                      b.No_of_copies,\
                      b.Edition,\
                      b.No_of_copies,\
                      b.Language,\
                      b.Category,\
                      b.Date,\
                      b.Type,\
                      b.Price,\
                      b.Publisher,\
                      b.Supplier_ID,\
                      b.Available_copies\
                      FROM book b,book_author ba,author a\
                      WHERE b.Book_ID=ba.Book_ID AND ba.Author_ID=a.Author_ID AND (b.Book_Name LIKE '%"+ req.query.id + "%' OR b.ISBN='" + req.query.id + "' OR a.Name LIKE '%" + req.query.id + "%' OR b.Book_ID='" + req.query.id + "') GROUP BY b.Book_ID ";
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
        message: "Failed",
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
exports.getBookCategoryList = function (req, res) {
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

/* ### Add Books ## */
exports.addbook = function (req, res) {
  console.log(req.body);
  let addBookQuery = "\
                          INSERT INTO book\
                          (ISBN, Book_Name, Language, Category, Type, Price, Publisher, Edition, Date, No_of_copies, Supplier_ID,Available_copies)\
                          VALUES(\
                          '" + req.body.book.isbn + "',\
                          '" + req.body.book.book_name + "',\
                          '" + req.body.book.language + "',\
                          '" + req.body.book.category_id + "',\
                          '" + req.body.book.type + "',\
                          '" + req.body.book.price + "',\
                          '" + req.body.book.publisher_id + "',\
                          '" + req.body.book.edition + "',\
                          '" + req.body.book.date + "',\
                          '" + req.body.book.copies + "',\
                          '" + req.body.book.supplier_id + "',\
                          '" + req.body.book.copies + "'\
                        )";
  db.query(addBookQuery, (err, result) => {
    // console.log(req.query.userName)
    if (err)
      return res.status(200).json({
        message: "Failed",
        isSuccess: false
      });
    else {
      if (result.affectedRows > 0) {
        let authors = req.body.author;
        let authorarray = [];
        authors.forEach(element => {
          console.log(result.insertId);
          console.log(element);
          authorarray.push(new Array(result.insertId, element));
        });
        let addAuthorQuery = "\
        INSERT INTO book_author\
        (Book_ID, Author_ID) VALUES ?";
        console.log("233r234" + authorarray);
        db.query(addAuthorQuery, [authorarray], (err, result_a) => {
          if (err)
            return res.status(200).json({
              message: "Failed",
              isSuccess: false
            });
          else {
            if (result_a.affectedRows > 0) {
              return res.status(200).json({
                response: "Book Details Added Successfully",
                message: "Book Details Added Successfully",
                isSuccess: true
              });
            }
          }
        });

      }
    }
  });
}

/* ### update_books ## */
exports.updateBooks = function (req, res) {
  console.log(req.body);
  let updateBookQuery = "\
                      UPDATE book\
                      SET\
                      ISBN='" + req.body.isbn + "',\
                      Book_Name='" + req.body.book_name + "',\
                      Language='" + req.body.language + "',\
                      Category='" + req.body.category_id + "',\
                      Type='" + req.body.type + "',\
                      Price='" + req.body.price + "',\
                      Publisher='" + req.body.publisher_id + "',\
                      Edition='" + req.body.edition + "',\
                      Date='" + req.body.date + "',\
                      No_of_copies='" + req.body.copies + "',\
                      Supplier_ID='" + req.body.supplier_id + "'\
                      WHERE Book_ID='"+ req.body.book_id + "' ";

  let deleteBookAuthorQuery = "DELETE FROM book_author WHERE Book_ID = '" + req.body.book_id + "' ";

  let updateBookAuthorQuery = "\
                      INSERT INTO book_author\
                      (Book_ID, Author_ID) VALUES ?";

  db.query(updateBookQuery, (err, result) => {
    if (err)
      return res.status(200).json({ message: "Failed",isSuccess: false });
    else {
      if (result.affectedRows > 0) {
        db.query(deleteBookAuthorQuery, (err, result) => {
          if (err)
            return res.status(200).json({ message: "Failed",isSuccess: false });
          else {
            if (result.affectedRows > 0) {
              let authors = req.body.author;
              let authorarray = [];
              authors.forEach(element => {
                console.log(result.insertId);
                console.log(element);
                authorarray.push(new Array(req.body.book_id, element));
              });

              db.query(updateBookAuthorQuery, [authorarray], (err, result) => {
                if (err)
                  return res.status(200).json({ message: "Failed",isSuccess: false });
                else {
                  if (result.affectedRows > 0) {
                    return res.status(200).json({
                      message: result.affectedRows + " " + "Record/s Updated",
                      isSuccess: true
                    });
                  }
                  else {
                    return res.status(200).json({
                      message: err,
                      isSuccess: false
                    });
                  }
                }
              });
            }
            else {
              return res.status(200).json({
                message: err,
                isSuccess: false
              });
            }
          }
        });
      }
      else {
        return res.status(200).json({
          message: "Book Update Failed",
          isSuccess: false
        });
      }
    }
  });
}

/* ### get_History ## */
exports.getHistory = function (req, res) {
  let searchHistoryQuery = "\
                      SELECT b.Book_ID,b.ISBN,b.Book_Name,bb.Borrow_Date,bb.Return_Date,bb.Return_status\
                      FROM book_borrow bb,book b \
                      WHERE b.Book_ID=bb.Book_ID AND bb.Member_ID = '"+ req.query.id + "'";
  db.query(searchHistoryQuery, (err, result) => {
    if (err)
      return res.status(200).json({ message: "Failed",isSuccess: false });
    else {
      if (result[0]) {
        return res.status(200).json({
          history: result,
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

/* ### get_History ## */
exports.burrowBooks = function (req, res) {
  let addAuthorQuery = "\
  INSERT INTO book_borrow\
  (Book_ID, Member_ID, Borrow_Date, Return_Date, Return_Status) VALUES ?";
  db.query(addAuthorQuery,[req.body.bookDetails],(err, result) => {
    if (err)
      return res.status(500).json({ message: "Failed",isSuccess: false });
    else {
      if (result.affectedRows > 0) {
        return res.status(200).json({
          message: "Success",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          message: "Failed",
          isSuccess: false
        });
      }
    }
  });
}

/* ### Increment books## */
exports.incrementBooks = function (req, res) {
  let incrementBooksQuery = "\
  UPDATE book\
  SET Available_copies=Available_copies+'"+req.query.count+"' WHERE Book_ID='"+req.query.id+"'";
  db.query(incrementBooksQuery,(err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result.affectedRows > 0) {
        return res.status(200).json({
          message: "Book Count Updated",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          message: "Book Count Update Failed",
          isSuccess: false
        });
      }
    }
  });
}

/* ### Decrement books## */
exports.decrementBooks = function (req, res) {
  let decrementBooksQuery = "\
  UPDATE book\
  SET Available_copies=Available_copies-'"+req.query.count+"' WHERE Book_ID='"+req.query.id+"'";
  db.query(decrementBooksQuery,(err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result.affectedRows > 0) {
        return res.status(200).json({
          message: "Book Count Updated",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          message: "Book Count Update Failed",
          isSuccess: false
        });
      }
    }
  });
}


/* ### Decrement books## */
exports.updateStatus = function (req, res) {
  let updateStateQuery="UPDATE book_borrow SET Return_Status='Returned'\
   WHERE Book_ID='"+req.query.book_id+"' AND Member_ID='"+req.query.member_id+"' AND Borrow_Date='"+req.query.date+"' "
  db.query(updateStateQuery,(err, result) => {
    if (err)
      return res.status(500).json({ message: err });
    else {
      if (result.affectedRows > 0) {
        return res.status(200).json({
          message: "Book Status Updated",
          isSuccess: true
        });
      }
      else {
        return res.status(200).json({
          message: "Book Status Update Failed",
          isSuccess: false
        });
      }
    }
  });
}

/* ### Reserve_Books ## */
exports.reserveBooks = function (req, res) {
  console.log(req.body);
  let addReservationQuery = "\
                          INSERT INTO book_reservation\
                         (Book_ID, Member_ID, Expire_Date, Reserve_Date)\
                          VALUES ?";
  db.query(addReservationQuery,[req.body.reservation], (err, result) => {
    if (err)
      return res.status(200).json({
        message: "Failed",
        isSuccess: false
      });
    else {
      if (result.affectedRows > 0) {
        return res.status(200).json({
          response: "Successfull",
          message: "Successfull",
          isSuccess: true
        });

      }
    }
  });
}


/* ### Payments ## */
exports.pay = function (req, res) {
  console.log(req.body);
  let addPaymentQuery = "\
                          INSERT INTO payment\
                         (Description, Date, Member_ID, Amount)\
                          VALUES ?";
  db.query(addPaymentQuery,[req.body.payment], (err, result) => {
    if (err)
      return res.status(200).json({
        message: err,
        isSuccess: false
      });
    else {
      if (result.affectedRows > 0) {
        return res.status(200).json({
          response: "Successfull",
          message: "Successfull",
          isSuccess: true
        });

      }
    }
  });
}
