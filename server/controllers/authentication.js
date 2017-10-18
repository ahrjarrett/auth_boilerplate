const jwt = require('jwt-simple')
const User = require('../models/user')
const config = require('../config')

function generateUserToken(user) {
  const timestamp = new Date().getTime()
  // sub = subject, iat = issuedAtTime
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = function(req, res, next) {
  // Here they're already auth'd, they just need a token
  res.send({ token: generateUserToken(req.user) })
}

exports.signup = function(req, res, next) {
  const { email, password } = req.body

  if(!email || !password) {
    return res.status(422).send({
      error: 'You must provide an email and password'
    })
  }

  // see if user w given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if(err) return next(err)

    // if user exists, return error
    if(existingUser) {
      return res.status(422).send({ error: 'Email already in use'})
    }

    // if a user does not exist, create & save new record
    const user = new User({ email, password })

    user.save(function(err) {
      if(err) return next(err)

      // respond to request indicated user was created
      res.json({ token: generateUserToken(user) })
    })

  })
}

