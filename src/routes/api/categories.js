import express from 'express'
const router = express.Router()
import auth from '../../middleware/auth'
// import role from '../../middleware/role'
import Category from '../../models/Category'

router.get('/:id', auth, role('supplierManagement'), ({ params }, res) => {
  Category.findById(params.id)
    .then(category => {
      res.json(category)
    })
    .catch(err => res.json(err))
})

router.put('/:id', auth, role('supplierManagement'), ({ body }, res) => {
  const newCategory = {
    name: body.name,
    _id: body._id
  }
  Category.findByIdAndUpdate(body._id, newCategory, { new: true })
    .then(category => {
      res.json(category)
    })
    .catch(err => res.json(err))
})

router.get(
  '/:objects/:page/:query',
  auth,
  role('supplierManagement'),
  ({ params }, res) => {
    const { objects, page, query } = params
    let newQuery = ''
    if (query === 'undefined') newQuery = ''
    else newQuery = query

    Category.find({ name: { $regex: newQuery, $options: 'i' } })
      .limit(Number(objects))
      .skip(objects * (page - 1))
      .sort({ createAt: -1 })
      .then(category => res.json(category))
      .catch(err => res.json(err))
  }
)

router.get(
  '/count/:query',
  auth,

  ({ params }, res) => {
    const { query } = params
    let newQuery = ''
    if (query === 'undefined') newQuery = ''
    else newQuery = query
    Category.find({ name: { $regex: newQuery, $options: 'i' } })
      .countDocuments()
      .sort({ createAt: -1 })
      .then(counter => res.json(counter))
      .catch(err => res.json(err))
  }
)

router.post('/', auth, role('supplierManagement'), ({ body }, res) => {
  const newCategory = new Category({
    _id: body._id,
    createAt: body.createAt,
    name: body.name
  })

  newCategory
    .save()
    .then(category => res.json(category))
    .catch(err => res.json(err))
})

router.delete('/:id', auth, role('supplierManagement'), ({ params }, res) => {
  Category.findByIdAndDelete(params.id)
    .then(item => res.json(item))
    .catch(err => res.json(err))
})

export default router
