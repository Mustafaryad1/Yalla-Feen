const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true 
      },
    description: { 
      type: String,
       required: true 
      },
    tags: [{
      type:String
    }],
    categoryImage: {
        type: String 
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema, "yalla_feen_category");

module.exports = Category;
