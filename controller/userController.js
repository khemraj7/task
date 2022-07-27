const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { isValidObjectId } = require('mongoose')

const signup = async (req, res, next) => {
  // console.log(req.body)
  let isUserExist = await isEmailExist(req.body.email)
  console.log(isUserExist)
  // console.log("isUserExist", isUserExist)
  if (isUserExist) {
    return res.json({
      message: 'Email Already Exist ',
      status: 422,
    })
  } else {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      console.log(hash)
      if (err) {
        return res.json({
          error: err,
        })
      } else {
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          password: hash,
        })
        console.log(user)
        user
          .save()
          .then((result) => {
            if (result) {
              let token = jwt.sign({ name: user.name }, 'VerySecretValue', {
                expiresIn: '1h',
              })
              result.password = ''
              res.json({
                result: result,
              })
            }
          })
          .catch((error) => {
            res.status(500).json({
              error: err,
            })
          })
      }
    })
  }
}

const login = (req, res, next) => {
  const username = req.body.email
  const password = req.body.password

  User.findOne({ $or: [{ email: username }] }).then((user) => {
    console.log(user)
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          res.json({
            error: err,
          })
        }
        if (result) {
          let token = jwt.sign({ name: user.name }, 'VerySecretValue', {
            expiresIn: '1h',
          })
          user.password = ''
          res.json({
            message: 'login Successfully',
            status: 200,
            user: user,
            token: token,
          })
        } else {
          res.json({
            message: 'Password does not match',
            status: 206,
          })
        }
      })
    } else {
      res.json({
        message: 'No user Found',
        status: 404,
      })
    }
  })
}

const isEmailExist = async (email) => {
  let user = await User.findOne({ email: email })
  if (user != null) {
    return true
  } else {
    return false
  }
}

module.exports = { signup, login }
