const express = require('express')
const app = express();
var mysql = require('mysql');

const port = 3000
// var memberRouter = require('./routes/member');
var loginRouter = require('./routes/login');

//sql
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database:"test"
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

// app.use('/member', memberRouter);
app.use('/', loginRouter);

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`Express server is listening to ${port}`)
})