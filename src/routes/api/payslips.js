import express from "express";
const router = express.Router();

//PaySlip Model
import PaySlip from "../../models/PaySlip";

router.get("/:id", ({ params }, res) => {
  PaySlip.findById(params.id)
    .then(payslip => {
      res.json(payslip);
    }) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.get("", (req, res) => {
  PaySlip.find()
    .then(payslip => {
      res.json(payslip);
    }) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.put("/:id", ({ body }, res) => {
  const newPaySlip = {
    idMember: body.idMember,
    idSupplier: body.idSupplier,
    createddate: body.createddate,
    totalAmt: body.totalAmt,
    _id: body._id
  };
  PaySlip.findByIdAndUpdate(body._id, newPaySlip, { new: true })
    .then(payslip => {
      res.json(payslip);
    }) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.get("/:objects/:page/:query", ({ params }, res) => {
  const { objects, page, query } = params;
  let newQuery = "";
  if (query === "undefined") newQuery = "";
  else newQuery = query;

  PaySlip.find({ idMember: { $regex: newQuery, $options: "i" } })
    .limit(Number(objects))
    .skip(objects * (page - 1))
    .sort({ createddate: -1 }) //desc = -1 acs = 1
    .then(payslip => res.json(payslip)) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.get("/count/:query", ({ params }, res) => {
  const { query } = params;
  let newQuery = "";
  if (query === "undefined") newQuery = "";
  else newQuery = query;

  PaySlip.find({ idMember: { $regex: newQuery, $options: "i" } })
    .countDocuments()
    .sort({ createddate: -1 }) //desc = -1 acs = 1
    .then(counter => res.json(counter)) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.post("/", ({ body }, res) => {
  const newPaySlip = new PaySlip({
    _id: body._id,
    idMember: body.idMember,
    idSupplier: body.idSupplier,
    createddate: body.createddate,
    totalAmt: body.totalAmt
  });

  newPaySlip
    .save()
    .then(payslip => res.json(payslip)) //reutnr lại item đã save đc
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.delete("/:id", ({ params }, res) => {
  // Có 2 cách:
  //          + Tìm ra bằng "findById" rồi "remove"
  //          + Tìm và xóa bằng "findByIdAndDelete"
  // Cách 2 là best practice

  // ----------------Cách 1------------------
  //   Item.findById(req.params.id)
  //     .then(item => item.remove().then(() => res.json({ success: true })))
  //     .catch(err => res.status(404).json({ success: false }));
  // ----------------Cách 2------------------
  console.log(params.id);

  PaySlip.findByIdAndDelete(params.id)
    .then(payslip => res.json(payslip)) //Return lại item đã xóa
    .catch(err => res.json(err)); //Catch lỗi rồi return ra
});

export default router;
