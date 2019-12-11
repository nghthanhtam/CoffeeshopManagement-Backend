const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema

const StorageReportSchema = new Schema({
    //Không cần thuộc tính ID vì trong MongoDB sẽ tự tạo ID cho mình khi insert vào
    idMember: {
        type: String, // Kiểu String
        required: true //=> khi insert vào thì bắt buộc phải có "name"
    },
    idMaterial: {
        type: String, // Kiểu String
        required: true
    },
    quantity: {
        type: Number, // Kiểu Number
        required: true,
        default: 0
    },
    createddate: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

module.exports = StorageReport = mongoose.model("storagereport", StorageReportSchema);

