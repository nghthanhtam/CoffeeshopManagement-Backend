import mongoose from "mongoose";
const Schema = mongoose.Schema;

//Create Schema

const CounterSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  sequence_value: {
    type: Number,
    default: 0,
    required: true
  }
});

const Counter = mongoose.model("counter", CounterSchema);

export default Counter;
