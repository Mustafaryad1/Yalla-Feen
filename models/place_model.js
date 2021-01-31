const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaceSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    tags: ["see food"],
    workStart: { type: Date },
    workEnd: { type: Date },
    vistorType: ["family", "single", "friends", "groupe"],
    budgetType: ["single", "more than 2", "more than 10"],
    phone: { type: String },
    placeImages: [{ type: String, required: true }],
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
