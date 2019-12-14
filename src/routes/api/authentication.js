import express from 'express'
const router = express.Router()
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import auth from '../../middleware/auth'
import 'dotenv/config'
import Role from '../../models/Role'
import User from '../../models/User'

//@route POST api/auth
//@desc Authenticate user
//@access Public
router.post('/', async ({ body }, res, next) => {
  try {
    const { username, password } = body

    if (!username || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' })
    }

    let user = await User.findOne({ username })

    if (!user) {
      return res.status(400).json({ msg: "User doesn't exist" })
    }

    let isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' })
    }

    let role = await Role.findOne({ _id: user.idRole })

    if (!role) {
      return res.status(400).json({ msg: "Role doesn't exist" })
    }
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
  } catch (error) {
    return next(error)
  }
})
//@route GET api/auth/user
//@desc Get user
//@access Private
router.get('/user', auth, ({ user }, res) => {
  User.findById(user.id)
    .select('-password')
    .then(user => res.json(user))
    .catch(err => res.json(err))
})

export default router
