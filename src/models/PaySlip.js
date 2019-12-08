import mongoose from 'mongoose'
const Schema = mongoose.Schema

const PaySlipSchema = new Schema({
  idMember: {
    type: String,
    required: false
  },
  idSupplier: {
    type: String,
    required: false
  },
  createddate: {
    type: Date,
    required: false,
    default: Date.now()
  },
  totalAmt: {
    type: Number,
    required: false,
    default: 0
  }
})

const PaySlip = mongoose.model('payslip', PaySlipSchema)

export default PaySlip
