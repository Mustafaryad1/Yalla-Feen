// Yalla Feen Libraries Requriments
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const parsed = require('dotenv').config().parsed;

// ;
const user_routes = require('./routes/user_routes');
const place_routes = require('./routes/placeRoutes');
const comment_routes = require('./routes/commentRoutes');
const category_routes = require('./routes/category_routes');
const favorite_routes= require('./routes/favorite_routes');
const tags_routes= require('./routes/tags_routes');

// config express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(cors());
// serve static 
app.use(express.static('uploads'));
// user Images
app.use('/user-images', express.static(__dirname + '/uploads/user'));
// place Images
app.use('/place-images', express.static(__dirname + '/uploads/place'));


//------------------------------------------
// config mongodb
// const mongodbURI = 'mongodb://localhost:27017/yallafeen'

mongoose.connect(parsed.mongodbURI, {useNewUrlParser: true,useUnifiedTopology: true});
//-------------------------------------------

// app root routes
app.get('/',(req,res)=>{
  res.send({'homepage':'this is home page'});
});

//-----------------------------------------
// load routes
app.use('/user',user_routes);
app.use('/place',place_routes);
app.use('/comment',comment_routes);
app.use('/category',category_routes);
app.use('/favorite',favorite_routes);
app.use('/tags',tags_routes);

// test joi
// const validation_body = require('./middleware/validationBody')
// const test = require('./validation-schema/tset')
// app.post('/test',validation_body(test.UserScehma),(req,res)=>{
//   console.log('/update'); 
//   res.json(req.body);
// })

// app.get('/test',(req,res) => {
//     console.log(req);
//     res.send({success:true})
// });
// //


// run express app 

app.listen(parsed.PORT);