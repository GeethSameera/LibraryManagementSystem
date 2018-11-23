const express = require('express')
const app = express()
const port = 3000
var memberRouter = require('./routes/member');

app.get('/', (request, response) => {
  response.send('Hello from Express!')
})

app.use('/addmember', memberRouter);

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`Express server is listening to ${port}`)
})