const express = require("express");
const router = express.Router();


const InvoiceDet = require("../../models/InvoiceDet");


router.get("/:id", (req, res) => {
  InvoiceDet.findById(req.params.id)
    .then(invoicedet => {
      res.json(invoicedet);
    }) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.get("/getall/:query", (req, res) => {
  const { query } = req.params;
  let newQuery = "";
  if (query === "undefined") newQuery = "";
  else newQuery = query;

  InvoiceDet.find()
    .sort({ createAt: -1 }) //desc = -1 acs = 1
    .then(invoicedet => res.json(invoicedet)) //return lại item 
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.put("/:id", (req, res) => {
  console.log(req.body);

  const newInvoiceDet = {
    idInvoice: req.body.idInvoice,
    idProduct: req.body.idProduct,
    price: req.body.price,
    quantity: req.body.quantity,
    discount: req.body.discount,
    _id: req.body._id
  };
  InvoiceDet.findByIdAndUpdate(req.body._id, newInvoiceDet, { new: true })
    .then(invoicedet => {
      res.json(invoicedet);
    }) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});


router.get("/:objects/:page/:query", (req, res) => {
  const { objects, page, query } = req.params;
  let newQuery = "";
  if (query === "undefined") newQuery = "";
  else newQuery = query;

  InvoiceDet.find({ idMember: { $regex: newQuery, $options: "i" } })
    .limit(Number(objects))
    .skip(objects * (page - 1))
    //.sort({ createddate: -1 }) //desc = -1 acs = 1
    .then(invoicedet => res.json(invoicedet)) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});


router.get("/count/:query", (req, res) => {
  const { query } = req.params;
  let newQuery = "";
  if (query === "undefined") newQuery = "";
  else newQuery = query;

  InvoiceDet.find({ name: { $regex: newQuery, $options: "i" } })
    .countDocuments()
    .sort({ createddate: -1 }) //desc = -1 acs = 1
    .then(counter => res.json(counter)) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});


router.post("/", (req, res) => {
  const newInvoiceDet = new InvoiceDet({
    idInvoice: req.body.idInvoice,
    idProduct: req.body.idProduct,
    price: req.body.price,
    quantity: req.body.quantity,
    discount: req.body.discount,
    _id: req.body._id
  });

  newInvoiceDet
    .save()
    .then(invoicedet => res.json(invoicedet)) //reutnr lại item đã save đc
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});


router.delete("/:id", (req, res) => {

  InvoiceDet.findByIdAndDelete(req.params.id)
    .then(item => res.json(item)) //Return lại item đã xóa
    .catch(err => res.json(err)); //Catch lỗi rồi return ra
});

module.exports = router;
