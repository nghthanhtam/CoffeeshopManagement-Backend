import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
require("dotenv").config();

//User Model
import User from "../../models/User";

//@route POST api/users
//@desc Register new user
//@access Public
router.post("/", ({ body }, res) => {
  const { idRole, username, password, fullName, phoneNumber, address } = body;

  //Simple validation
  if (
    !username ||
    !idRole ||
    !fullName ||
    !phoneNumber ||
    !address ||
    !password
  ) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //Check for existing user
  User.findOne({ username }).then(user => {
    if (user) {
      return res.status(400).json({ msg: "User already exist" });
    }
    const newUser = new User({
      username,
      idRole,
      fullName,
      phoneNumber,
      address,
      password
    });

    //Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
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
          })

          .catch(err => res.json(err));
      });
    });
  });
});

export default router;
