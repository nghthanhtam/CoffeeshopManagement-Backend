const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema

const MemberSchema = new Schema({
  //Không cần thuộc tính ID vì trong MongoDB sẽ tự tạo ID cho mình khi insert vào
  name: {
    type: String, // Kiểu String
    required: true //=> khi insert vào thì bắt buộc phải có "name"
  },
  phone: {
    type: String, // Kiểu String
    required: true
  },
  point: {
    type: Number, // Kiểu Number
    required: true,
    default: 0
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now()
  }
});

module.exports = Member = mongoose.model("member", MemberSchema);
