import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  idRole: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },

  address: {
    type: String,
    required: true
  }
});

const User = mongoose.model("user", UserSchema);

export default User;
