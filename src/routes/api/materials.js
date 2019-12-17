import express from 'express'
const router = express.Router()
import Material from '../../models/Material'
import auth from '../../middleware/auth'
import role from '../../middleware/role'
import Role from '../../Role'

router.get('/:id', auth, role(Role.materialManagement), ({ params }, res) => {
  Material.findById(params.id)
    .then(material => {
      res.json(material)
    })
    .catch(err => res.json(err))
})

router.put(
  '/:id',
  auth,
  role(Role.materialManagement),
  ({ body, params }, res) => {
    const newMaterial = {
      name: body.name,
      quantity: body.quantity,
      _id: params.id
    }
    Material.findByIdAndUpdate(params.id, newMaterial, { new: true })
      .then(material => {
        res.json(material)
      })
      .catch(err => res.json(err))
  }
)

router.get(
  '/:objects/:page/:query',
  auth,
  role(Role.materialManagement),
  ({ params }, res) => {
    const { objects, page, query } = params
    let newQuery = ''
    if (query === 'undefined') newQuery = ''
    else newQuery = query

    Material.find({ name: { $regex: newQuery, $options: 'i' } })
      .limit(Number(objects))
      .skip(objects * (page - 1))
      .sort({ createAt: -1 })
      .then(material => res.json(material))
      .catch(err => res.json(err))
  }
)

router.get('/count/:query', ({ params }, res) => {
  const { query } = params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  Material.find({ name: { $regex: newQuery, $options: 'i' } })
    .countDocuments()
    .sort({ createAt: -1 })
    .then(counter => res.json(counter))
    .catch(err => res.json(err))
})

router.post('/', auth, role(Role.materialManagement), ({ body }, res) => {
  const newMaterial = new Material({
    name: body.name,
    quantity: body.quantity
  })

  newMaterial
    .save()
    .then(material => res.json(material))
    .catch(err => res.json(err))
})

router.delete(
  '/:id',
  auth,
  role(Role.materialManagement),
  ({ params }, res) => {
    Material.findByIdAndDelete(params.id)
      .then(item => res.json(item))
      .catch(err => res.json(err))
  }
)

export default router
