var express = require('express')
var router = express.Router()
// var db = require('./database')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' })
})

router.post

module.exports = router
