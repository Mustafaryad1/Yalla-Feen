// Yalla Feen Libraries Requriments
const express = require('express');
const user_routes = require('./routes/user_routes')




// config express app

const app = express()
app.set(express.json())

//-----------------------------------------

// app root routes
app.get('/',(req,res)=>{
  res.send({'homepage':'this is home page'})
})


//-----------------------------------------
// load routes
app.use('/user',user_routes)
//-------------




// run express app 

app.listen(3000)