// Yalla Feen Libraries Requriments
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const parsed = require('dotenv').config().parsed

// routes
const user_routes = require('./routes/user_routes')
const place_routes = require('./routes/placeRoutes')
const comment_routes = require('./routes/commentRoutes')
const category_routes = require('./routes/category_routes')

// config express app
const app = express()
app.use(bodyParser.json())
app.use(cors())

//------------------------------------------
// config mongodb
// const mongodbURI = 'mongodb://localhost:27017/yallafeen'

mongoose.connect(parsed.mongodbURI, {useNewUrlParser: true,useUnifiedTopology: true});
//-------------------------------------------

// app root routes
app.get('/',(req,res)=>{
  res.send({'homepage':'this is home page'})
})

//-----------------------------------------
// load routes
app.use('/user',user_routes)
app.use('/place',place_routes)
app.use('/comment',comment_routes)
app.use('/category',category_routes)

//


// run express app 

app.listen(parsed.PORT)