const User = require("../models/user_model");
const jwt = require('jsonwebtoken');

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
  res.send('this is user profile ');
}

// signup api method
module.exports.signup_post = async (req, res) => {
  try{
    const {email,username,password}= req.body;
    let user = await User.create({email:email,username:username});
    user.setPassword(password);
    user.save();
    res.send({user})
    }catch(err){
      console.log(err);
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