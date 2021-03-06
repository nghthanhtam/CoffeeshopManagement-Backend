import express from 'express'
const router = express.Router()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

import User from '../../models/User'
import auth from '../../middleware/auth'
import role from '../../middleware/role'
import Role from '../../Role'

router.post(
  '/',
  auth,
  role(Role.userManagement),
  async ({ body }, res, next) => {
    try {
      const {
        idRole,
        username,
        password,
        fullName,
        phoneNumber,
        address
      } = body

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

      let user = await User.findOne({ username })

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
                  id: user.id,
                  idRole: user.idRole,
                  role
                },
                process.env.jwtSecret,
                { expiresIn: 24 * 3600 },
                (err, token) => {
                  if (err) throw err
                  res.json({
                    token,
                    user: {
                      id: user.id,
                      idRole: user.idRole
                    },
                    role
                  })
                }
              )
            })

            .catch(err => res.json(err))
        })
      })
    } catch (error) {
      return next(error)
    }
  }
)

router.get('/:id', auth, role(Role.userManagement), (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      res.json(user)
    })
    .catch(err => res.json(err))
})

router.put('/:id', auth, role(Role.userManagement), (req, res) => {
  const newUser = ({
    idRole,
    username,
    password,
    fullName,
    phoneNumber,
    address
  } = req.body)

  bcrypt.hash(newUser.password, 10, (err, hash) => {
    if (err) return res.json(err)
    newUser.password = hash
    User.findByIdAndUpdate(req.body._id, newUser, { new: true })
      .then(user => {
        res.json(user)
      })
      .catch(err => res.json(err))
  })
})

router.get(
  '/:objects/:page/:query',
  auth,
  role(Role.userManagement),
  (req, res) => {
    const { objects, page, query } = req.params
    let newQuery = ''
    if (query === 'undefined') newQuery = ''
    else newQuery = query

    User.find({ username: { $regex: newQuery, $options: 'i' } })
      .limit(Number(objects))
      .skip(objects * (page - 1))

      .then(user => res.json(user))
      .catch(err => res.json(err))
  }
)

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

router.delete('/:id', auth, role(Role.userManagement), (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(item => res.json(item))
    .catch(err => res.json(err))
})

router.post('/cp/:id', auth, role(Role.userManagement), (req, res) => {
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
