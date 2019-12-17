import express from 'express'
const router = express.Router()

import Invoice from '../../models/Invoice'
import auth from '../../middleware/auth'
import role from '../../middleware/role'
import Role from '../../Role'

router.get('/:id', auth, role(Role.invoiceManagement), ({ params }, res) => {
  Invoice.findById(params.id)
    .then(invoice => {
      res.json(invoice)
    })
    .catch(err => res.json(err))
})

router.put(
  '/:id',
  auth,
  role(Role.invoiceManagement),
  ({ body, params }, res) => {
    const newInvoice = {
      idMember: body.idMember,
      idUser: body.idUser,
      totalAmt: body.totalAmt,
      createddate: body.createddate,
      comments: body.comments,
      _id: params.id
    }
    Invoice.findByIdAndUpdate(params.id, newInvoice, { new: true })
      .then(invoice => {
        res.json(invoice)
      })
      .catch(err => res.json(err))
  }
)

router.get(
  '/:objects/:page/:query',
  auth,
  role(Role.invoiceManagement),
  ({ params }, res) => {
    const { objects, page, query } = params
    let newQuery = ''
    if (query === 'undefined') newQuery = ''
    else newQuery = query

    Invoice.find({ idMember: { $regex: newQuery, $options: 'i' } })
      .limit(Number(objects))
      .skip(objects * (page - 1))

      .then(invoice => res.json(invoice))
      .catch(err => res.json(err))
  }
)

router.get('/count/:query', ({ params }, res) => {
  const { query } = params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  Invoice.find({ name: { $regex: newQuery, $options: 'i' } })
    .countDocuments()
    .sort({ createddate: -1 })
    .then(counter => res.json(counter))
    .catch(err => res.json(err))
})

router.post('/', auth, role(Role.invoiceManagement), ({ body }, res) => {
  const newInvoice = new Invoice({
    _id: body._id,
    idMember: body.idMember,
    idUser: body.idUser,
    totalAmt: body.totalAmt,
    createddate: body.createddate,
    comments: body.comments
  })

  newInvoice
    .save()
    .then(invoice => res.json(invoice))
    .catch(err => res.json(err))
})

router.delete('/:id', auth, role(Role.invoiceManagement), ({ params }, res) => {
  Invoice.findByIdAndDelete(params.id)
    .then(item => res.json(item))
    .catch(err => res.json(err))
})

export default router
