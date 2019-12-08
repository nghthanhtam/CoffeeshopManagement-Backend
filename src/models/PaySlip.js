import mongoose from "mongoose";
const Schema = mongoose.Schema;

//Create Schema

const PaySlipSchema = new Schema({
  //Không cần thuộc tính ID vì trong MongoDB sẽ tự tạo ID cho mình khi insert vào
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
});

const PaySlip = mongoose.model("payslip", PaySlipSchema);

export default PaySlip;
