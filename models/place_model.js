const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaceSchema = new Schema(
  {
    title: {
      type: String,
      required: true 
      },
    description: { 
      type: String,
       required: true 
      },
    location: { 
      type: String,
       required: true 
      },
    type: { 
       type: String,
       required: true 
      },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
      }],
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    tags: [{
      type:String
    }],
    workStart: {
      type: Date 
    },
    workEnd: { 
      type: Date 
    },
    vistorType: [{
      type:String
    }],
    budgetType: [{
      type:String
    }],
    phone: { 
      type: String 
    },
    placeImages: [{ type: String}],
    // reviews: [
    //   {
    //     type: Array,
    //     review: {
    //       username: { type: String },
    //       comment: { typr: String },
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);

const Place = mongoose.model("Place", PlaceSchema, "yalla_feen_places");

module.exports = Place;
