'use strict';

var express = require('express');
var router = express.Router();
var db = require('../database');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;