const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const keys = require('../config/key');
const {roles} = require('../roles');

let id=null;

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
        id =decodedToken.id
        next();
      }
    });
  } else {
    res.redirect('/user/login');
  }
};

const grantAccess = (action,resource)=>{
  return async(req,res,next)=>{
   try{
      const user = await User.findById(id)
      console.log('-------------------user-------------')
      // console.log(id);
      console.log(user.role);
      const permission = roles.can(user.role)[action](resource);
      if (!permission.granted) {
       return res.status(401).json({
        error: "You don't have enough permission to perform this action"
       });
      }
      next()
   }catch(err){
      next(err);
   }
  }
}





module.exports = { requireAuth,grantAccess};