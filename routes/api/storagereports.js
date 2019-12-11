const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();

//StorageReport Model
const StorageReport = require("../../models/StorageReport");

//search theo query, them duong dan /api/storagereport/search/ trong file server
router.get("/search/:query", (req, res) => {
    const { query } = req.params;
    let newQuery = "";
    if (query === "undefined") newQuery = "";
    else newQuery = query;

    StorageReport.find({ idMaterial: { $regex: newQuery, $options: "i" } })
        .sort({ createddate: -1 }) //desc = -1 acs = 1
        .then(storagereport => res.json(storagereport)) //return lại item 
        .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.get("/:id", auth, (req, res) => {
    StorageReport.findById(req.params.id)
        .then(storagereport => {
            res.json(storagereport);
        }) //return lại item
        .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.get('', auth, (req, res) => {
    StorageReport.find()
        .then(storagereport => {
            res.json(storagereport);
        }) //return lại item
        .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.put("/:id", auth, (req, res) => {
    const newStorageReport = {
        idMember: req.body.idMember,
        idMaterial: req.body.idMaterial,
        quantity: req.body.quantity,
        createddate: req.body.createddate,
        _id: req.body._id
    };
    StorageReport.findByIdAndUpdate(req.body._id, newStorageReport, { new: true })
        .then(storagereport => {
            res.json(storagereport);
        }) //return lại item
        .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});


router.get("/:objects/:page/:query", auth, (req, res) => {
    const { objects, page, query } = req.params;
    let newQuery = "";
    if (query === "undefined") newQuery = "";
    else newQuery = query;

    StorageReport.find({ idMaterial: { $regex: newQuery, $options: "i" } })
        .limit(Number(objects))
        .skip(objects * (page - 1))
        .sort({ createddate: -1 }) //desc = -1 acs = 1
        .then(storagereport => res.json(storagereport)) //return lại item
        .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});


router.get("/count/:query", (req, res) => {
    const { query } = req.params;
    let newQuery = "";
    if (query === "undefined") newQuery = "";
    else newQuery = query;

    StorageReport.find({ idMaterial: { $regex: newQuery, $options: "i" } })
        .countDocuments()
        .sort({ createddate: -1 }) //desc = -1 acs = 1
        .then(counter => res.json(counter)) //return lại item
        .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

//@route POST /storagereport   (dùng phương thức POST và route là /storagereport)
//@desc  Create a storagereport  (miểu tả APi làm gì)
//@access Public            (access hiện tại là public vì Trung chưa tạo authentication)
router.post("/", auth, (req, res) => {
    const newStorageReport = new StorageReport({
        idMember: req.body.idMember,
        idMaterial: req.body.idMaterial,
        quantity: req.body.quantity,
        createddate: req.body.createddate,
        _id: req.body._id
    });

    newStorageReport
        .save()
        .then(storagereport => res.json(storagereport)) //reutnr lại item đã save đc
        .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.delete("/:id", auth, (req, res) => {

    console.log(req.params.id);

    StorageReport.findByIdAndDelete(req.params.id)
        .then(item => res.json(item)) //Return lại item đã xóa
        .catch(err => res.json(err)); //Catch lỗi rồi return ra
});

module.exports = router;
