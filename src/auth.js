const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { DB } = require('./schema/db.js')

passport.use('local', new LocalStrategy(
  function (username, password, done) {
    let checkPassword = DB.Users.checkPassword(username, password)

    checkPassword
      .then((isValid) => {
        if (isValid) {
          return DB.Users.getUserByUsername(username)
        } else {
          throw new Error('invalid username or password')
        }
      })
      .then((user) => {
        return done(null, user)
      })
      .catch((err) => {
        return done(err)
      })
  }
))

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  DB.Users.get(id).then((user, err) => {
    return done(err, user)
  })
})

exports.configure = function (cthulhu) {
  cthulhu.use(passport.initialize())
  cthulhu.use(passport.session())

  // Login route for PassportJS
  cthulhu.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
}
