const express = require('express')
const app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

const port = 3000

//Referring to files in routes folder
var loginRouter = require('./routes/login');
var memberRouter = require('./routes/member');
var bookRouter = require('./routes/book');
var supplierRouter = require('./routes/supplier');
var donatorRouter = require('./routes/donator');
var emailRouter = require('./routes/email');

var authorRouter = require('./routes/author');
var publisherRouter = require('./routes/publisher');
var reportsRouter = require('./routes/report');
//sql
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database:"librarysystem"
});

con.connect((err)=>{
  if(err){
    throw err;
  }
  else{
    global.db = con;
    console.log("Connected To DB");
  }
})

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

// Main Routings
app.use('/', loginRouter);
app.use('/member/',memberRouter);
app.use('/book/',bookRouter);
app.use('/supplier/',supplierRouter);
app.use('/donator/',donatorRouter);
app.use('/email/',emailRouter);
app.use('/author/',authorRouter);
app.use('/publisher/',publisherRouter);
app.use('/reports/',reportsRouter);


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`Express server is listening to ${port}`)
})