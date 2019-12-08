import express from 'express'
const router = express.Router()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
require('dotenv').config()

import User from '../../models/User'

router.post('/', ({ body }, res) => {
  const { idRole, username, password, fullName, phoneNumber, address } = body

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

export default router
