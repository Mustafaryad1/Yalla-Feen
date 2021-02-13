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
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    images: [{ type: String}],
    
  },
  { timestamps: true }
);
PlaceSchema.index({ location: '2dsphere' });

const Place = mongoose.model("Place", PlaceSchema, "yalla_feen_places");

module.exports = Place;
