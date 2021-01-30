const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Place = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    tags: [""],
    workStart: { type: Date },
    workEnd: { type: Date },
    vistorType: ["", "", "", ""],
    budgetType: ["", "", ""],
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

const Place = mongoose.model("Place", PlaceSchema, "yalla_feen_Places");

module.exports = Place;
