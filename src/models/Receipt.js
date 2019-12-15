import mongoose from 'mongoose'
const Schema = mongoose.Schema

var ItemSchema = new mongoose.Schema({
  idMaterial: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const RecieptSchema = new Schema({
  user: {
    name: { type: String },
    id: { type: String }
  },
  supplier: {
    name: { type: String },
    id: { type: String }
  },
  createdDate: {
    type: Date,
    required: false,
    default: new Date()
  },
  items: [ItemSchema],
  amountDue: {
    type: Number,
    required: false,
    default: 0
  }
})

const Reciept = mongoose.model('reciept', RecieptSchema)

export default Reciept
