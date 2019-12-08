import mongoose from "mongoose";
const Schema = mongoose.Schema;

//Create Schema

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now()
  }
});

const Category = mongoose.model("category", CategorySchema);

export default Category;
