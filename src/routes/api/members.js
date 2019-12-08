import express from 'express'
const router = express.Router()

import Member from '../../models/Member'

router.get('/search/:query', ({ params }, res) => {
  const { query } = params

  if (query === 'undefined') newQuery = ''
  else newQuery = query

  Member.find({ name: { $regex: newQuery, $options: 'i' } })
    .sort({ createAt: -1 })
    .then(member => res.json(member))
    .catch(err => res.json(err))
})

router.get('/:id', ({ params }, res) => {
  Member.findById(params.id)
    .then(member => {
      res.json(member)
    })
    .catch(err => res.json(err))
})

router.get('', (req, res) => {
  Member.find()
    .then(member => {
      res.json(member)
    })
    .catch(err => res.json(err))
})

router.put('/:id', ({ body }, res) => {
  const newMember = {
    name: body.name,
    phone: body.phone,
    point: body.point,
    _id: body._id
  }
  Member.findByIdAndUpdate(body._id, newMember, { new: true })
    .then(member => {
      res.json(member)
    })
    .catch(err => res.json(err))
})

router.get('/:objects/:page/:query', ({ params }, res) => {
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
})

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

router.post('/', ({ body }, res) => {
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

router.delete('/:id', ({ params }, res) => {
  console.log(params.id)

  Member.findByIdAndDelete(params.id)
    .then(item => res.json(item))
    .catch(err => res.json(err))
})

export default router
