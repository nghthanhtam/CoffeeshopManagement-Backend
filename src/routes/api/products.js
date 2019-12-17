import express from 'express'
const router = express.Router()

import Product from '../../models/Product'

import auth from '../../middleware/auth'
import role from '../../middleware/role'
import Role from '../../Role'

router.get('/:id', auth, role(Role.productManagement), ({ params }, res) => {
  Product.findById(params.id)
    .then(product => {
      res.json(product)
    })
    .catch(err => res.json(err))
})

router.put(
  '/:id',
  auth,
  role(Role.productManagement),
  ({ body, params }, res) => {
    const newProduct = {
      idCategory: body.idCategory,
      name: body.name,
      price: body.price,
      quantity: body.quantity,
      status: body.status,
      _id: params.id
    }
    Product.findByIdAndUpdate(params.id, newProduct, { new: true })
      .then(product => {
        res.json(product)
      })
      .catch(err => res.json(err))
  }
)

router.get(
  '/:objects/:page/:query',
  auth,
  role(Role.productManagement),
  ({ params }, res) => {
    const { objects, page, query } = params
    let newQuery = ''
    if (query === 'undefined') newQuery = ''
    else newQuery = query

    Product.find({ name: { $regex: newQuery, $options: 'i' } })
      .limit(Number(objects))
      .skip(objects * (page - 1))
      .sort({ createAt: -1 })
      .then(product => res.json(product))
      .catch(err => res.json(err))
  }
)

router.get('/count/:query', ({ params }, res) => {
  const { query } = params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  Product.find({ name: { $regex: newQuery, $options: 'i' } })
    .countDocuments()
    .sort({ createAt: -1 })
    .then(counter => res.json(counter))
    .catch(err => res.json(err))
})

router.post('/', auth, role(Role.productManagement), ({ body }, res) => {
  const newProduct = new Product({
    _id: body._id,
    idCategory: body.idCategory,
    name: body.name,
    price: body.price,
    quantity: body.quantity,
    status: body.status
  })

  newProduct
    .save()
    .then(product => res.json(product))
    .catch(err => res.json(err))
})

router.delete('/:id', auth, role(Role.productManagement), ({ params }, res) => {
  Product.findByIdAndDelete(params.id)
    .then(item => res.json(item))
    .catch(err => res.json(err))
})

export default router
