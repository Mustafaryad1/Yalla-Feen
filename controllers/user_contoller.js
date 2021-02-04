const User = require("../models/user_model");
const jwt = require('jsonwebtoken');
const userImagesURL = require('dotenv').config().parsed.USERIMAGESURL
const upload = require('../middleware/upload').upload

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}


// user profile
module.exports.profile = (req, res) => {

  res.send({profile:req.user});
}
// get users
module.exports.get_users = async(req,res)=>{
  const users = await User.find({});
  res.send({usersData:users})
}
// signup api method
module.exports.signup_post = async(req, res) => {
 try{
    const {password} = req.body
    const user = new User(req.body)
    user.setPassword(password);
    await user.save()
    res.send({success:true,message:"user has been created",data:user.generateJWT()})
 }catch(err){
   res.send({success:false,message:"faild to create user"})
 }
}

// login method[POST]  user/login

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    res.status(200).json({ user: user._id ,token:user.generateJWT()});
  }
  catch (err) {
    // const errors = handleErrors(err);
    res.status(400).json({ error:err.message });
  }

}
module.exports.uploadAvatar = async(req,res) =>{
  upload.single('avatar')(req,res,err=>{
    if(err){
      return res.status(400).send({
        success:false,
        message:"allow file is image and size 2mb"})
    }
    req.user.avatar = userImagesURL+req.file.filename
    req.user.save()
    res.send({message:"User profile update",sccuess:true})
  })
}