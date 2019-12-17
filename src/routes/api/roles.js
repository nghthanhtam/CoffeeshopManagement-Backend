import express from 'express'
const router = express.Router()
import auth from '../../middleware/auth'
import role from '../../middleware/role'
import Role from '../../models/Role'

router.get('/:id', auth, role('roleManagement'), ({ params }, res) => {
  Role.findById(params.id)
    .then(role => {
      res.json(role)
    })
    .catch(err => res.json(err))
})

router.put('/:id', auth, role('roleManagement'), ({ body, params }, res) => {
  const {
    name,
    memberManagement,
    productManagement,
    categoryManagement,
    userManagement,
    invoiceManagement,
    supplierManagement,
    payslipManagement,
    materialManagement,
    roleManagement,
    materialReceiptNoteManagement
  } = body
  const newRole = {
    _id: params.id,
    name,
    memberManagement,
    productManagement,
    categoryManagement,
    userManagement,
    invoiceManagement,
    supplierManagement,
    payslipManagement,
    materialManagement,
    materialReceiptNoteManagement,
    roleManagement
  }
  Role.findByIdAndUpdate(params.id, newRole, { new: true })
    .then(role => {
      res.json(role)
    })
    .catch(err => res.json(err))
})

router.get(
  '/:objects/:page/:query',
  auth,
  role('roleManagement'),
  ({ params }, res) => {
    const { objects, page, query } = params
    let newQuery = ''
    if (query === 'undefined') newQuery = ''
    else newQuery = query

    Role.find({ name: { $regex: newQuery, $options: 'i' } })
      .limit(Number(objects))
      .skip(objects * (page - 1))
      .sort({ createAt: -1 })
      .then(role => res.json(role))
      .catch(err => res.json(err))
  }
)

router.get('/count/:query', ({ params }, res) => {
  const { query } = params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  Role.find({ name: { $regex: newQuery, $options: 'i' } })
    .countDocuments()
    .sort({ createAt: -1 })
    .then(counter => res.json(counter))
    .catch(err => res.json(err))
})

router.post('/', auth, role('roleManagement'), ({ body }, res) => {
  const {
    _id,
    name,
    memberManagement,
    productManagement,
    categoryManagement,
    userManagement,
    invoiceManagement,
    supplierManagement,
    payslipManagement,
    materialManagement,
    roleManagement,
    materialReceiptNoteManagement
  } = body
  console.log(body)

  const newRole = new Role({
    _id,
    name,
    memberManagement,
    productManagement,
    categoryManagement,
    userManagement,
    invoiceManagement,
    supplierManagement,
    payslipManagement,
    materialManagement,
    roleManagement,
    materialReceiptNoteManagement
  })
  console.log(newRole)

  newRole
    .save()
    .then(role => res.json(role))
    .catch(err => res.json(err))
})

router.delete('/:id', auth, role('roleManagement'), ({ params }, res) => {
  Role.findByIdAndDelete(params.id)
    .then(item => res.json(item))
    .catch(err => res.json(err))
})

export default router
