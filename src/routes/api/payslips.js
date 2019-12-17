import express from 'express'
const router = express.Router()

import PaySlip from '../../models/PaySlip'
import auth from '../../middleware/auth'
import role from '../../middleware/role'
import Role from '../../Role'

router.get('/:id', auth, role(Role.payslipManagement), ({ params }, res) => {
  PaySlip.findById(params.id)
    .then(payslip => {
      res.json(payslip)
    })
    .catch(err => res.json(err))
})

router.get('/', auth, role(Role.payslipManagement), (req, res) => {
  PaySlip.find()
    .then(payslip => {
      res.json(payslip)
    })
    .catch(err => res.json(err))
})

router.put(
  '/:id',
  auth,
  role(Role.payslipManagement),
  ({ body, params }, res) => {
    const { idUser, idSupplier, createddate, totalAmt } = body
    const newPaySlip = {
      idUser,
      idSupplier,
      createddate,
      totalAmt,
      _id: params.id
    }
    PaySlip.findByIdAndUpdate(params.id, newPaySlip, { new: true })
      .then(payslip => {
        res.json(payslip)
      })
      .catch(err => res.json(err))
  }
)

router.get(
  '/:objects/:page/:query',
  auth,
  role(Role.payslipManagement),
  ({ params }, res) => {
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
  }
)

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

router.post('/', auth, role(Role.payslipManagement), ({ body }, res) => {
  const { idUser, idSupplier, createddate, totalAmt, _id } = body
  const newPaySlip = new PaySlip({
    _id,
    idUser,
    idSupplier,
    createddate,
    totalAmt
  })

  newPaySlip
    .save()
    .then(payslip => res.json(payslip))
    .catch(err => res.json(err))
})

router.delete('/:id', auth, role(Role.payslipManagement), ({ params }, res) => {
  PaySlip.findByIdAndDelete(params.id)
    .then(payslip => res.json(payslip))
    .catch(err => res.json(err))
})

export default router
