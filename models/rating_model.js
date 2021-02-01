const mongoose = require("mongoose");

const Rating = mongoose.model(
  "Rating",
  new mongoose.Schema({
    user: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    rate_value: {
        type:Number,
        default:0,
        required:true
      }
  
  },{
    timestamps:true
  })
);

module.exports = Rating;
