'use strict'

var lusca = require('lusca')

module.exports = function (cthulhu, luscaConfig) {
  // Enable Lusca security
  cthulhu.use(lusca(luscaConfig || {
    csrf: true,
    csp: {
      default_src: "'self'",
      script_src: "'self'",
      image_src: "'self'"
    },
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true
    },
    xssProtection: true
  }))
}
