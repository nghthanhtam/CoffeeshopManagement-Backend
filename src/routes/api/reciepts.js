import express from 'express'
const router = express.Router()
import auth from '../../middleware/auth'

import Reciept from '../../models/Receipt'

router.get('/:id', ({ params }, res) => {
  PaySlip.findById(params.id)
    .then(payslip => {
      res.json(payslip)
    })
    .catch(err => res.json(err))
})

router.get('', (req, res) => {
  PaySlip.find()
    .then(payslip => {
      res.json(payslip)
    })
    .catch(err => res.json(err))
})

router.put('/:id', ({ body }, res) => {
  const newPaySlip = {
    idMember: body.idMember,
    idSupplier: body.idSupplier,
    createddate: body.createddate,
    totalAmt: body.totalAmt,
    _id: body._id
  }
  PaySlip.findByIdAndUpdate(body._id, newPaySlip, { new: true })
    .then(payslip => {
      res.json(payslip)
    })
    .catch(err => res.json(err))
})

router.get('/:objects/:page/:query', ({ params }, res) => {
  const { objects, page, query } = params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  PaySlip.find({ idMember: { $regex: newQuery, $options: 'i' } })
    .limit(Number(objects))
    .skip(objects * (page - 1))
    .sort({ createddate: -1 })
    .then(payslip => res.json(payslip))
    .catch(err => res.json(err))
})

router.get('/count/:query', ({ params }, res) => {
  const { query } = params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  PaySlip.find({ idMember: { $regex: newQuery, $options: 'i' } })
    .countDocuments()
    .sort({ createddate: -1 })
    .then(counter => res.json(counter))
    .catch(err => res.json(err))
})

router.post('/', auth, ({ body, user }, res) => {
  let newReciept = new Reciept({
    idUser: user.id,
    idSupplier: body.idSupplier,
    createdDate: body.createdDate,
    items: body.items
  })

  let { items } = newReciept
  let amountDue = 0

  items.forEach(item => (amountDue += item.quantity * item.price))
  newReciept.amountDue = amountDue
  newReciept
    .save()
    .then(reciept => res.json(reciept))
    .catch(err => res.json(err))
})

router.delete('/:id', auth, ({ params }, res) => {
  Reciept.findByIdAndDelete(params.id)
    .then(reciept => res.json(reciept))
    .catch(err => res.json(err))
})

export default router
