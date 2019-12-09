import express from 'express'
const router = express.Router()

import Invoice from '../../models/Invoice'

router.get('/:id', ({ params }, res) => {
  Invoice.findById(params.id)
    .then(invoice => {
      res.json(invoice)
    })
    .catch(err => res.json(err))
})

router.put('/:id', ({ body }, res) => {
  const newInvoice = {
    idMember: body.idMember,
    idUser: body.idUser,
    totalAmt: body.totalAmt,
    createddate: body.createddate,
    comments: body.comments,
    _id: body._id
  }
  Invoice.findByIdAndUpdate(body._id, newInvoice, { new: true })
    .then(invoice => {
      res.json(invoice)
    })
    .catch(err => res.json(err))
})

router.get('/:objects/:page/:query', ({ params }, res) => {
  const { objects, page, query } = params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  Invoice.find({ idMember: { $regex: newQuery, $options: 'i' } })
    .limit(Number(objects))
    .skip(objects * (page - 1))

    .then(invoice => res.json(invoice))
    .catch(err => res.json(err))
})

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

router.post('/', ({ body }, res) => {
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

router.delete('/:id', ({ params }, res) => {
  Invoice.findByIdAndDelete(params.id)
    .then(item => res.json(item))
    .catch(err => res.json(err))
})

export default router
