import express from 'express'
const router = express.Router()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import auth from '../../middleware/auth'
require('dotenv').config()

import User from '../../models/User'

router.post('/', ({ body }, res) => {
  const { username, password } = body

  if (!username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' })
  }

  User.findOne({ username }).then(user => {
    if (!user) {
      return res.status(400).json({ msg: "User doesn't exist" })
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' })

      jwt.sign(
        {
          id: user.id,
          role: user.idRole
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
  })
})

router.get('/user', auth, ({ user }, res) => {
  User.findById(user.id)
    .select('-password')
    .then(user => res.json(user))
    .catch(err => res.json(err))
})

export default router
