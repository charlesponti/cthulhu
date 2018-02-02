const uuid = require('uuid')
const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

module.exports = function (cthulhu, config) {
  if (config.secret === void 0) throw Error('Must provide `secret` in configuration')

  cthulhu.use(session({
    genid: function (req) {
      return uuid.v4()
    },
    // Do not save session if nothing has been modified
    resave: false,
    // Do not create session unless something is to be stored
    saveUninitialized: false,
    secret: config.secret,
    store: new RedisStore({
      host: config.redisHost,
      port: config.redisPort,
      client: redis.createClient()
    })
  }))
}
