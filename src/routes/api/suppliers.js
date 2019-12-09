import express from 'express'
const router = express.Router()

import Supplier from '../../models/Supplier'

router.get('/search/:query', ({ params }, res) => {
  const { query } = params

  if (query === 'undefined') newQuery = ''
  else newQuery = query

  Member.find({ name: { $regex: newQuery, $options: 'i' } })
    .sort({ createAt: -1 })
    .then(supplier => res.json(supplier))
    .catch(err => res.json(err))
})

router.get('/:id', ({ params }, res) => {
  Supplier.findById(params.id)
    .then(supplier => {
      res.json(supplier)
    })
    .catch(err => res.json(err))
})

router.get('', (req, res) => {
  Supplier.find()
    .then(supplier => {
      res.json(supplier)
    })
    .catch(err => res.json(err))
})

router.put('/:id', ({ body }, res) => {
  const newSupplier = {
    name: body.name,
    _id: body._id,
    phone: body.phone,
    address: body.address
  }
  Supplier.findByIdAndUpdate(body._id, newSupplier, { new: true })
    .then(supplier => {
      res.json(supplier)
    })
    .catch(err => res.json(err))
})

router.get('/:objects/:page/:query', ({ params }, res) => {
  const { objects, page, query } = params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  Supplier.find({ name: { $regex: newQuery, $options: 'i' } })
    .limit(Number(objects))
    .skip(objects * (page - 1))
    .sort({ createAt: -1 })
    .then(supplier => res.json(supplier))
    .catch(err => res.json(err))
})

router.get('/count/:query', ({ params }, res) => {
  const { query } = params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  Supplier.find({ name: { $regex: newQuery, $options: 'i' } })
    .countDocuments()
    .sort({ createAt: -1 })
    .then(counter => res.json(counter))
    .catch(err => res.json(err))
})

router.post('/', ({ body }, res) => {
  const newSupplier = new Supplier({
    name: body.name,
    phone: body.phone,
    address: body.address
  })

  newSupplier
    .save()
    .then(supplier => res.json(supplier))
    .catch(err => res.json(err))
})

router.delete('/:id', ({ params }, res) => {
  Supplier.findByIdAndDelete(params.id)
    .then(item => res.json(item))
    .catch(err => res.json(err))
})

export default router
