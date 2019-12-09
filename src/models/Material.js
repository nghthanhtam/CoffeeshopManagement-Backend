import mongoose from 'mongoose'
const Schema = mongoose.Schema

const MaterialSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now()
  },
  quantity: {
    type: Number,
    required: true
  }
})

const Material = mongoose.model('material', MaterialSchema)

export default Material
