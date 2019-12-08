import mongoose from 'mongoose'
const Schema = mongoose.Schema

const MemberSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  point: {
    type: Number,
    required: true,
    default: 0
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

const Member = mongoose.model('member', MemberSchema)

export default Member
