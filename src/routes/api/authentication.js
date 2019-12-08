import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../../middleware/auth";
require("dotenv").config();

//User Model
import User from "../../models/User";

//@route POST api/auth
//@desc Authenticate user
//@access Public
router.post("/", ({ body }, res) => {
  const { username, password } = body;

  //Simple validation
  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //Check for existing user
  User.findOne({ username }).then(user => {
    if (!user) {
      return res.status(400).json({ msg: "User doesn't exist" });
    }

    //Validate password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      jwt.sign(
        {
          id: user.id,
          role: user.idRole
        },
        process.env.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;

          res.json({
            token,
            user: {
              name: user.username,
              id: user.id,
              idRole: user.idRole,
              fullName: user.fullName
            }
          });
        }
      );
    });
  });
});

//@route GET api/auth/user
//@desc Get user
//@access Private
router.get("/user", auth, ({ user }, res) => {
  User.findById(user.id)
    .select("-password")
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

export default router;
