const mongoose = require("mongoose");

const Favorite = mongoose.model(
  "Favorite",
  new mongoose.Schema({
    user: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
     place: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Place",
        required:true
    }
  
  },{
    timestamps:true
  })
);

module.exports = Favorite;
