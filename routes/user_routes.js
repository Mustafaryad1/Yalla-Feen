const router = require('express').Router();
const User = require('../models/user_model');
const {requireAuth} = require('../middleware/authMiddleware')
const authController = require('../controllers/user_contoller')

// user routes include signup and login methods 
// /user 
router.get('/',requireAuth,authController.profile)
router.post('/signup',authController.signup_post);
router.post('/login',authController.login_post);


router.get('/login',(req,res)=>{
  res.send({'login':'this is login get page'})
});


module.exports = router