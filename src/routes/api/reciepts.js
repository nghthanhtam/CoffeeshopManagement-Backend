import express from 'express'
const router = express.Router()
import auth from '../../middleware/auth'

import Reciept from '../../models/Receipt'

router.get('/:id', auth, async ({ params }, res, next) => {
  try {
    let reciept = await Reciept.findById(params.id)
    res.json(reciept)
  } catch (err) {
    res.json(err)
  }
})

router.get('', async (req, res, next) => {
  try {
    let reciepts = await Reciept.find()

    res.json(reciepts)
  } catch (err) {
    res.json(err)
  }
})

router.put('/:id', auth, async ({ body, params, user }, res) => {
  try {
    let newReciept = {
      idUser: user.id,
      idSupplier: body.idSupplier,
      createdDate: body.createdDate,
      items: body.items
    }

    let { items } = newReciept
    let amountDue = 0

    items.forEach(item => {
      item.total = item.quantity * item.price
      amountDue += item.total
    })

    newReciept.amountDue = amountDue

    let receipt = await Reciept.findByIdAndUpdate(params.id, newReciept, {
      new: true,
      overwrite: true
    })

    res.json(receipt)
  } catch (err) {
    res.json(err)
  }
})

router.get('/:objects/:page/:query', ({ params }, res) => {
  const { objects, page, query } = params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  Reciept.find({ idMember: { $regex: newQuery, $options: 'i' } })
    .limit(Number(objects))
    .skip(objects * (page - 1))
    .sort({ createddate: -1 })
    .then(reciept => res.json(reciept))
    .catch(err => res.json(err))
})

router.get('/count/:query', ({ params }, res) => {
  const { query } = params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  Reciept.find({ idMember: { $regex: newQuery, $options: 'i' } })
    .countDocuments()
    .sort({ createddate: -1 })
    .then(counter => res.json(counter))
    .catch(err => res.json(err))
})

router.post('/', auth, ({ body, user }, res) => {
  let newReciept = new Reciept({
    idUser: user.id,
    idSupplier: body.idSupplier,
    createdDate: body.createdDate,
    items: body.items
  })

  let { items } = newReciept
  let amountDue = 0

  items.forEach(item => {
    item.total = item.quantity * item.price
    amountDue += item.total
  })

  newReciept.amountDue = amountDue

  newReciept
    .save()
    .then(reciept => res.json(reciept))
    .catch(err => res.json(err))
})

router.delete('/:id', auth, async ({ params }, res, next) => {
  try {
    await Reciept.findByIdAndDelete(params.id)
    res.json({ msg: 'ok' })
  } catch (err) {
    res.json(err)
  }
})

export default router
