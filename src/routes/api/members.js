import express from 'express'
const router = express.Router()

import Member from '../../models/Member'
import auth from '../../middleware/auth'
import role from '../../middleware/role'
import Role from '../../Role'

router.get(
  '/search/:query',
  auth,
  role(Role.memberManagement),
  ({ params }, res) => {
    const { query } = params

    if (query === 'undefined') newQuery = ''
    else newQuery = query

    Member.find({ name: { $regex: newQuery, $options: 'i' } })
      .sort({ createAt: -1 })
      .then(member => res.json(member))
      .catch(err => res.json(err))
  }
)

router.get('/:id', auth, role(Role.memberManagement), ({ params }, res) => {
  Member.findById(params.id)
    .then(member => {
      res.json(member)
    })
    .catch(err => res.json(err))
})

router.get('', auth, role(Role.memberManagement), (req, res) => {
  Member.find()
    .then(member => {
      res.json(member)
    })
    .catch(err => res.json(err))
})

router.put(
  '/:id',
  auth,
  role(Role.memberManagement),
  ({ body, params }, res) => {
    const newMember = {
      name: body.name,
      phone: body.phone,
      point: body.point,
      _id: params.id
    }
    Member.findByIdAndUpdate(params.id, newMember, { new: true })
      .then(member => {
        res.json(member)
      })
      .catch(err => res.json(err))
  }
)

router.get(
  '/:objects/:page/:query',
  auth,
  role(Role.memberManagement),
  ({ params }, res) => {
    const { objects, page, query } = params
    let newQuery = ''
    if (query === 'undefined') newQuery = ''
    else newQuery = query

    Member.find({ name: { $regex: newQuery, $options: 'i' } })
      .limit(Number(objects))
      .skip(objects * (page - 1))
      .sort({ createAt: -1 })
      .then(member => res.json(member))
      .catch(err => res.json(err))
  }
)

router.get('/count/:query', ({ params }, res) => {
  const { query } = params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  Member.find({ name: { $regex: newQuery, $options: 'i' } })
    .countDocuments()
    .sort({ createAt: -1 })
    .then(counter => res.json(counter))
    .catch(err => res.json(err))
})

router.post('/', auth, role(Role.memberManagement), ({ body }, res) => {
  const newMember = new Member({
    _id: body._id,
    name: body.name,
    phone: body.phone,
    point: body.point
  })

  newMember
    .save()
    .then(member => res.json(member))
    .catch(err => res.json(err))
})

router.delete('/:id', auth, role(Role.memberManagement), ({ params }, res) => {
  Member.findByIdAndDelete(params.id)
    .then(item => res.json(item))
    .catch(err => res.json(err))
})

export default router
