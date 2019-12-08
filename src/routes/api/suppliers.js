import express from "express";
const router = express.Router();

//Supplier Model
import Supplier from "../../models/Supplier";

//search theo query, them duong dan /api/supplier/search/ trong file server
router.get("/search/:query", ({ params }, res) => {
  const { query } = params;
  //let newQuery = "";
  if (query === "undefined") newQuery = "";
  else newQuery = query;

  Member.find({ name: { $regex: newQuery, $options: "i" } })
    .sort({ createAt: -1 }) //desc = -1 acs = 1
    .then(supplier => res.json(supplier)) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.get("/:id", ({ params }, res) => {
  Supplier.findById(params.id)
    .then(supplier => {
      res.json(supplier);
    })
    .catch(err => res.json(err));
});

router.get("", (req, res) => {
  Supplier.find()
    .then(supplier => {
      res.json(supplier);
    }) // resturn lại item
    .catch(err => res.json(err)); // catch lỗi rồi return ra
});

router.put("/:id", ({ body }, res) => {
  console.log(body);

  const newSupplier = {
    name: body.name,
    _id: body._id,
    phone: body.phone,
    address: body.address
  };
  Supplier.findByIdAndUpdate(body._id, newSupplier, { new: true })
    .then(supplier => {
      res.json(supplier);
    }) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

//@route GET /supplier     (dùng phương thức GET và route là /supplier)
//@desc  Get All categories  (miểu tả APi làm gì)
//@access Public
router.get("/:objects/:page/:query", ({ params }, res) => {
  const { objects, page, query } = params;
  let newQuery = "";
  if (query === "undefined") newQuery = "";
  else newQuery = query;

  Supplier.find({ name: { $regex: newQuery, $options: "i" } })
    .limit(Number(objects))
    .skip(objects * (page - 1))
    .sort({ createAt: -1 }) //desc = -1 acs = 1
    .then(supplier => res.json(supplier)) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.get("/count/:query", ({ params }, res) => {
  const { query } = params;
  let newQuery = "";
  if (query === "undefined") newQuery = "";
  else newQuery = query;

  Supplier.find({ name: { $regex: newQuery, $options: "i" } })
    .countDocuments()
    .sort({ createAt: -1 }) //desc = -1 acs = 1
    .then(counter => res.json(counter)) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.post("/", ({ body }, res) => {
  const newSupplier = new Supplier({
    name: body.name,
    phone: body.phone,
    address: body.address
  });

  newSupplier
    .save()
    .then(supplier => res.json(supplier)) //reutnr lại item đã save đc
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

router.delete("/:id", ({ params }, res) => {
  console.log(params.id);

  Supplier.findByIdAndDelete(params.id)
    .then(item => res.json(item)) //Return lại item đã xóa
    .catch(err => res.json(err)); //Catch lỗi rồi return ra
});

export default router;
