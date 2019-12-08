import mongoose from 'mongoose'
const Schema = mongoose.Schema

const InvoiceSchema = new Schema({
  idMember: {
    type: String,
    required: true
  },
  idUser: {
    type: String,
    required: true
  },
  totalAmt: {
    type: Number,
    required: true,
    default: 0
  },
  createddate: {
    type: Date,
    required: false,
    default: new Date()
  },
  comments: {
    type: String,
    required: false
  }
})

const Invoice = mongoose.model('invoice', InvoiceSchema)

export default Invoice
