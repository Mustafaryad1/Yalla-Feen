const router = require('express').Router();

const User = require('../models/user_model');

// yalla feen profile get methods
router.get('/',(req,res)=>{
  res.send({'profile':'this user profile page'})
})





//-------------------------------------------------------
// yalla feen login [get and post] methods
router.get('/login',(req,res)=>{
  res.send({'login':'this is login get page'})
});

router.post('/login',(req,res)=>{
  res.send({'login':'this is login post page',
             'data':'login data'+req.body.email
              })
});

//-------------------------------------------------------

// yalla feen signup [get and post] methods
router.post('/signup',async (req,res)=>{
  try{
  const {email,username,password}= req.body;
  let user = await User.create({email:email,username:username});
  user.setPassword(password);
  user.save();
  res.send({user})
  }catch(err){
    console.log(err);
  }
});

router.get('/signup',(req,res)=>{
  res.send({'signup':'this is signup post page',
             'data':'signup data'+req.body
              })
});
//-------------------------------------------------------
module.exports = router