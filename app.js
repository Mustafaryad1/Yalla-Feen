// Yalla Feen Libraries Requriments
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const user_routes = require('./routes/user_routes')



// config express app
const app = express()
app.use(bodyParser.json())

//------------------------------------------
// config mongodb
const mongodbURI = 'mongodb://localhost:27017/yallafeen'
mongoose.connect(mongodbURI, {useNewUrlParser: true});
//-------------------------------------------

// app root routes
app.get('/',(req,res)=>{
  res.send({'homepage':'this is home page'})
})
app.get('/potato',(req,res)=>{
  res.send({'homepage':'this is potato'})
})
app.get('/potato2',(req,res)=>{
  res.send({'homepage':'this is potato2'})
})

//-----------------------------------------
// load routes
app.use('/user',user_routes)
//-------------




// run express app 

app.listen(3000)