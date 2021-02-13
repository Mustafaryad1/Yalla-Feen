const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({
    user: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    },
    name: {
      type:String,
      required:true
    },
    email: {
        type:String,
        required:true
    },
    msg: {
      type:String,
      required:true
    },
  
  },{
    timestamps:true
  })
);

module.exports = Message;
