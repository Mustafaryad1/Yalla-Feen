const router = require('express').Router();
const {requireAuth,grantAccess} = require('../middleware/authMiddleware')
const authController = require('../controllers/user_contoller')
const upload = require('../middleware/upload').upload
const validation_body = require('../middleware/validationBody')
const userSchemas = require('../validation-schema/user')

// user routes include signup and login methods 
// /user 
router.get('/',requireAuth,grantAccess('readOwn','profile'),authController.profile);
router.post('/upload-profile-pic',requireAuth,authController.uploadAvatar);
router.get('/list',requireAuth,grantAccess('readAny','users'),authController.get_users);
router.post('/signup',validation_body(userSchemas.SignUpScehma),authController.signup_post);
router.post('/login',authController.login_post);
router.post('/login',authController.login_post);
router.post('/forget-password',authController.forgetPassword);
router.post('/reset-password-token',authController.resetPasswordWithToken);


router.get('/login',(req,res)=>{
  res.send({'login':'this is login get page'})
});


module.exports = router