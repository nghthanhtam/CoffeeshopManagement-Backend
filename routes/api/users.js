const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//User Model
const User = require("../../models/User");

//@route POST api/users
//@desc Register new user
//@access Public
router.post("/", (req, res) => {
  const {
    idRole,
    username,
    password,
    fullName,
    phoneNumber,
    address
  } = req.body;

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

//Get User by ID
router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      res.json(user);
    })
    .catch(err => res.json(err));
});

//Update User
router.put("/:id", (req, res) => {
  console.log(req.body);

  const newUser = ({
    idRole,
    username,
    password,
    fullName,
    phoneNumber,
    address
  } = req.body);

  bcrypt.hash(newUser.password, 10, (err, hash) => {
    if (err) return res.json(err);
    newUser.password = hash;
    User.findByIdAndUpdate(req.body._id, newUser, { new: true })
      .then(user => {
        res.json(user);
      })
      .catch(err => res.json(err));
  });
});

//Get all User
router.get("/:objects/:page/:query", (req, res) => {
  const { objects, page, query } = req.params;
  let newQuery = "";
  if (query === "undefined") newQuery = "";
  else newQuery = query;

  User.find({ username: { $regex: newQuery, $options: "i" } })
    .limit(Number(objects))
    .skip(objects * (page - 1))
    //.sort({ createAt: -1 }) //desc = -1 acs = 1
    .then(user => res.json(user)) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

//Get all Material
router.get("/count/:query", (req, res) => {
  const { query } = req.params;
  let newQuery = "";
  if (query === "undefined") newQuery = "";
  else newQuery = query;

  User.find({ username: { $regex: newQuery, $options: "i" } })
    .countDocuments()
    .sort({ createAt: -1 }) //desc = -1 acs = 1
    .then(counter => res.json(counter)) //return lại item
    .catch(err => res.json(err)); //Catch lỗi rồi return ra;
});

//Delete a User
router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(item => res.json(item)) //Return lại item đã xóa
    .catch(err => res.json(err)); //Catch lỗi rồi return ra
});

//@route POST api/auth
//@desc Check current password of user
//@access Public
router.post("/cp/:id", (req, res) => {
  const username = req.body.username;
  console.log("TCL: username", username);
  const password = req.body.curPassword;
  console.log("TCL: password", password);

  if (!username || !password) {
    return res.send({
      error: "User name and password required"
    });
  }

  User.findById(req.body._id).then(user => {
    if (!user) {
      return res.send({
        error: "Invalid user"
      });
    }
    console.log(user.password);

    bcrypt.compare(password, user.password, function(err, response) {
      console.log("TCL: response", response);
      if (err) return res.json(err);
      else if (response == false) {
        return res.json({ status: 400, msg: "Wrong" });
      } else {
        return res.json({ status: 200, msg: "Correct" });
      }
    });
  });
});

module.exports = router;
