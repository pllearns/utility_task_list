var express = require('express')
var router = express.Router()
var cookieSession = require('cookie-session')
var database = require('../database')
var cookieParser = require('cookie-parser')

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.render('profile', {
    session: req.session
  })
})

module.exports = router
