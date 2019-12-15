import express from 'express'
const router = express.Router()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import auth from '../../middleware/auth'

import User from '../../models/User'

router.post('/', auth, ({ body }, res) => {
  const { idRole, username, password, fullName, phoneNumber, address } = body

  console.log('post')

  if (
    !username ||
    !idRole ||
    !fullName ||
    !phoneNumber ||
    !address ||
    !password
  ) {
    return res.status(400).json({ msg: 'Please enter all fields' })
  }

  User.findOne({ username }).then(user => {
    if (user) {
      return res.status(400).json({ msg: 'User already exist' })
    }
    const newUser = new User({
      username,
      idRole,
      fullName,
      phoneNumber,
      address,
      password
    })

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err
        newUser.password = hash
        newUser
          .save()
          .then(user => {
            jwt.sign(
              {
                id: user.id
              },
              process.env.jwtSecret,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err

                res.json({
                  token,
                  user: {
                    name: user.username,
                    id: user.id,
                    idRole: user.idRole,
                    fullName: user.fullName
                  }
                })
              }
            )
          })

          .catch(err => res.json(err))
      })
    })
  })
})

router.get('/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      res.json(user)
    })
    .catch(err => res.json(err))
})

router.put('/:id', auth, ({ body }, res) => {
  const newUser = {
    idRole: body.idRole,
    username: body.username,
    password: body.password,
    fullName: body.fullName,
    phoneNumber: body.phoneNumber,
    address: body.address
  }

  bcrypt.hash(newUser.password, 10, (err, hash) => {
    if (err) return res.json(err)
    newUser.password = hash
    User.findByIdAndUpdate(body._id, newUser, { new: true })
      .then(user => {
        res.json(user)
      })
      .catch(err => res.json(err))
  })
})

router.get('/:objects/:page/:query', (req, res) => {
  const { objects, page, query } = req.params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  User.find({ username: { $regex: newQuery, $options: 'i' } })
    .limit(Number(objects))
    .skip(objects * (page - 1))

    .then(user => res.json(user))
    .catch(err => res.json(err))
})

router.get('/count/:query', (req, res) => {
  const { query } = req.params
  let newQuery = ''
  if (query === 'undefined') newQuery = ''
  else newQuery = query

  User.find({ username: { $regex: newQuery, $options: 'i' } })
    .countDocuments()
    .sort({ createAt: -1 })
    .then(counter => res.json(counter))
    .catch(err => res.json(err))
})

router.delete('/:id', auth, (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(item => res.json(item))
    .catch(err => res.json(err))
})

router.post('/cp/:id', auth, (req, res) => {
  const username = req.body.username
  const password = req.body.curPassword

  if (!username || !password) {
    return res.send({
      error: 'User name and password required'
    })
  }

  User.findById(req.body._id).then(user => {
    if (!user) {
      return res.send({
        error: 'Invalid user'
      })
    }

    bcrypt.compare(password, user.password, function(err, response) {
      if (err) return res.json(err)
      else if (response == false) {
        return res.json({ status: 400, msg: 'Wrong' })
      } else {
        return res.json({ status: 200, msg: 'Correct' })
      }
    })
  })
})

export default router
