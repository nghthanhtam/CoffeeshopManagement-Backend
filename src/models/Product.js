import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ProductSchema = new Schema({
  idCategory: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false
  },
  quantity: {
    type: Number,
    required: false,
    default: 0
  },
  status: {
    type: String,
    required: false
  }
})

const Product = mongoose.model('product', ProductSchema)

export default Product
