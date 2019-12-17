const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Create Schema

const InvoiceDetSchema = new Schema({
  //Không cần thuộc tính ID vì trong MongoDB sẽ tự tạo ID cho mình khi insert vào
  idInvoice: {
    type: String,
    required: true
  },
  idProduct: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: false,
    default: 0
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  discount: {
    type: Number,
    required: false
  }
})

module.exports = InvoiceDet = mongoose.model('invoicedet', InvoiceDetSchema)
