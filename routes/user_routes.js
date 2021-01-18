const router = require('express').Router();


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
router.get('/signup',(req,res)=>{
  res.send({'signup':'this is signup get page'})
});

router.post('/signup',(req,res)=>{
  res.send({'signup':'this is signup post page',
             'data':'signup data'+req.body
              })
});
//-------------------------------------------------------
module.exports = router