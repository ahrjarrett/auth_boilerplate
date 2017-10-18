const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

/* LOCALLOGIN strategy verifies email/password upon signing in */
// instead of username, look at email property:
const localOpts = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOpts, (email, password, done) => {
  User.findOne({ email }, function(err, user) {
    if(err) return done(err)
    if(!user) return done(null, false)

    user.comparePassword(password, function(err, isMatch) {
      if(err) return done(err)
      if(!isMatch) return done(null)

      return done(null, user)
    })
  })
})

/* JWTLOGIN strategy verifies token upon requesting access to a resource */
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

// payload is the decoded jwt token, done is cb fn (like next)
const jwtLogin = new JwtStrategy(jwtOpts, function(payload, done) {
  User.findById(payload.sub, function(err, user) {
    if(err) return done(err, false)

    // `null` here is the error object
    if(user) {
      return done(null, user)
    } else {
      // case no error, but didn't find user
      return done(null, false)
    }

  })
})

passport.use(jwtLogin)
passport.use(localLogin)

