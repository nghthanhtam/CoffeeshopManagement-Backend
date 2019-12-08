import express from 'express'
const router = express.Router()
import auth from '../../middleware/auth'
import mongoose from 'mongoose'

import Category from '../../models/Category'

router.get('/:id', auth, ({ params }, res) => {
  Category.findById(params.id)
    .then(category => {
      res.json(category)
      console.log(category)
    })
    .catch(err => res.json(err))
})

router.put('/:id', auth, ({ body }, res) => {
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

router.get('/:objects/:page/:query', auth, ({ params }, res) => {
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
})

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

router.post('/', auth, ({ body }, res) => {
  const newCategory = new Category({
    _id: body._id,
    createAt: body.createAt,
    name: body.name
  })
  console.log(body._id)

  newCategory
    .save()
    .then(category => res.json(category))
    .catch(err => res.json(err))
})

function insertDocument(doc, targetCollection) {
  while (1) {
    const cursor = targetCollection
      .find({}, { _id: 1 })
      .sort({ _id: -1 })
      .limit(1)

    const seq = cursor.hasNext() ? cursor.next()._id + 1 : 1

    doc._id = seq

    const results = targetCollection.insert(doc)

    if (results.hasWriteError()) {
      if (results.writeError.code == 11000) continue
      else print(`unexpected error inserting data: ${tojson(results)}`)
    }

    break
  }
}

router.delete('/:id', auth, ({ params }, res) => {
  Category.findByIdAndDelete(params.id)
    .then(item => res.json(item))
    .catch(err => res.json(err))
})

export default router
