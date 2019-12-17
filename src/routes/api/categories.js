import express from 'express'
const router = express.Router()
import Category from '../../models/Category'
import auth from '../../middleware/auth'
import role from '../../middleware/role'
import Role from '../../Role'

router.get('/:id', auth, role(Role.categoryManagement), ({ params }, res) => {
  Category.findById(params.id)
    .then(category => {
      res.json(category)
    })
    .catch(err => res.json(err))
})

router.put(
  '/:id',
  auth,
  role(Role.categoryManagement),
  ({ params, body }, res) => {
    const newCategory = {
      name: body.name,
      _id: params.id
    }
    Category.findByIdAndUpdate(params.id, newCategory, { new: true })
      .then(category => {
        res.json(category)
      })
      .catch(err => res.json(err))
  }
)

router.get(
  '/:objects/:page/:query',
  auth,
  role(Role.categoryManagement),
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

router.get('/count/:query', ({ params }, res) => {
  const { query } = params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query
  Category.find({ name: { $regex: newQuery, $options: 'i' } })
    .countDocuments()
    .sort({ createAt: -1 })
    .then(counter => res.json(counter))
    .catch(err => res.json(err))
})

router.post('/', auth, role(Role.categoryManagement), ({ body }, res) => {
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

router.delete(
  '/:id',
  auth,
  role(Role.categoryManagement),
  ({ params }, res) => {
    Category.findByIdAndDelete(params.id)
      .then(item => res.json(item))
      .catch(err => res.json(err))
  }
)

export default router
