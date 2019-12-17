import mongoose from 'mongoose'
const Schema = mongoose.Schema

const SupplierSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

const Supplier = mongoose.model('supplier', SupplierSchema)

export default Supplier
