const router = require('express').Router();
const {requireAuth,grantAccess} = require('../middleware/authMiddleware')
const authController = require('../controllers/user_contoller')
const upload = require('../middleware/upload').upload

// user routes include signup and login methods 
// /user 
router.get('/',requireAuth,grantAccess('readOwn','profile'),authController.profile);
router.get('/list',requireAuth,grantAccess('readAny','users'),authController.get_users);
router.post('/signup',authController.signup_post);
router.post('/login',authController.login_post);


router.get('/login',(req,res)=>{
  res.send({'login':'this is login get page'})
});


module.exports = router