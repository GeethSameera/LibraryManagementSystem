const express = require('express')
const app = express();
const cors=require('cors');

app.use(cors());

const port = 3000
var memberRouter = require('./routes/member');
var loginRouter = require('./routes/login');

app.use('/member', memberRouter);
app.use('/login', loginRouter);

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`Express server is listening to ${port}`)
})