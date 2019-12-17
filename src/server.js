import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import 'dotenv/config'
import 'babel-core/register'
import 'babel-polyfill'
import bcrypt from 'bcryptjs'

import categories from './routes/api/categories'
import suppliers from './routes/api/suppliers'
import users from './routes/api/users'
import auth from './routes/api/authentication'
import role from './routes/api/roles'
import member from './routes/api/members'
import product from './routes/api/products'
import invoice from './routes/api/invoices'
import payslip from './routes/api/payslips'
import materials from './routes/api/materials'

import User from './models/User'
import Role from './models/Role'

const app = express()

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('connect to mongodb')

  Role.findOne({ name: 'admin' })
    .then(role => {
      let roleID
      if (role === null) {
        console.log('Creating role admin')

        roleID = mongoose.Types.ObjectId()
        const roleAdmin = new Role({
          _id: roleID,
          name: 'admin',
          memberManagement: true,
          productManagement: true,
          categoryManagement: true,
          userManagement: true,
          invoiceManagement: true,
          supplierManagement: true,
          payslipManagement: true,
          materialManagement: true,
          roleManagement: true,
          materialReceiptNoteManagement: true
        })
        roleAdmin
          .save()
          .then(role => console.log(`Added Role ${role.name} succesfully`))
          .catch(err => console.log(err))
      } else console.log("Role 'Admin' already exists!!!")

      User.findOne({ username: 'admin' })
        .then(admin => {
          if (admin === null) {
            console.log('Creating user admin')
            const admin = new User({
              username: 'admin',
              idRole: roleID,
              password: 'admin'
            })
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(admin.password, salt, (err, hash) => {
                if (err) throw err
                admin.password = hash
                admin
                  .save()
                  .then(user => {
                    console.log(`Added user ${user.username}  succesfully`)
                  })
                  .catch(err => console.log(err))
              })
            })
          } else {
            console.log(`User ${admin.username} already exists!!!`)
          }
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})
app.get('/ping', (req, res) => {
  res.json('pong')
})

app.use('/api/payslip', payslip)
app.use('/api/invoice', invoice)
app.use('/api/product', product)
app.use('/api/member', member)
app.use('/api/role', role)
app.use('/api/auth', auth)
app.use('/api/category', categories)
app.use('/api/supplier', suppliers)
app.use('/api/user', users)
app.use('/api/material', materials)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started on port ${port}`))
