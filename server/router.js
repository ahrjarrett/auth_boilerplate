const Authentication = require('./controllers/authentication')
const passportService = require('./services/passport')
const passport = require('passport')

/* by default, passport wants to create a cookie session for user.
 * bc we're using JWT, we don't want this default behavior: */
const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

module.exports = app => {
  app.get('/', requireAuth, (req, res) => {
    res.json({ hi: 'there' })
  })

  app.post('/signin', requireSignin, Authentication.signin)
  app.post('/signup', Authentication.signup)
}

