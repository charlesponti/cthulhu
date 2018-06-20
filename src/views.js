const express = require('express')
const path = require('path')
const swig = require('swig')

const hour = 3600000
const day = hour * 24
const week = day * 7

module.exports = function (cthulhu, viewsDir) {
  cthulhu.use(
    express.static(
      path.resolve(`${process.env.INIT_DIR}/public`),
      { maxAge: week } // TTL (Time To Live) for static files
    )
  )

  // Set directory where views are stored.
  if (viewsDir) {
    cthulhu.set('views', path.resolve(process.env.INIT_DIR, viewsDir))
  }

  // Set view engine
  cthulhu.engine('html', swig.renderFile)
  cthulhu.set('view engine', 'html')

  // Disable view caching if in development
  if (global._env === 'development') {
    cthulhu.set('view cache', false)
    swig.setDefaults({
      cache: false,
      autoescape: false
    })
  } else {
    swig.setDefaults({
      autoescape: false
    })
  }
}
