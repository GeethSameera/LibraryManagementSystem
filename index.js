const express = require('express')
const app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

const port = 3000
var loginRouter = require('./routes/login');
var memberRouter = require('./routes/member');

//sql
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database:"login"
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

// app.use('/member', memberRouter);
app.use('/', loginRouter);
app.use('/member/',memberRouter);

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`Express server is listening to ${port}`)
})