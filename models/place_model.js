const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaceSchema = new Schema(
  {

    title: {
      type: String,
      required: true,
      unique:true,
      lowercase:true 
      },
    description: { 
      type: String,
       required: true 
      },
    location: { 
      type: {
         type: String,
         default:"Point" 
      },
      coordinates: [],
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
    category:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Category",
      required:true
    },
    rates:{
        type:Number,
        default:0
    },
    rating:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Rating"
    }],
    favorites_count:{
      type:Number,
      default:0,
    },
    tags: [{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Tags"
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
    images: [{ type: String}],
    
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
PlaceSchema.index({ location: '2dsphere' });

// PlaceSchema.pre('save',function(next,done){
//     this.location.collection.push(31.2357).push(31.2357)
//     done()
//   })
const Place = mongoose.model("Place", PlaceSchema, "yalla_feen_places");

module.exports = Place;
