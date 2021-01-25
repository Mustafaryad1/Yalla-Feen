const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const keys = require('../config/key');

const requireAuth = (req, res, next) => {
  const token = req.headers['authorization']
  console.log('this token--------'+token);
  // check json web token exists & is verified
  if (token) { // token has id,role
    jwt.verify(token,keys.JWTSecret ,(err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/user/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/user/login');
  }
};

module.exports = { requireAuth };