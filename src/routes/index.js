var express = require('express')
var router = express.Router()
var users = require('./users')
// var db = require('./database')

/* GET home page. */
router.get('/', (req, res, next) => {

  res.render('index', {
    title: 'Tasker'
  })
  return;
})

router.get('/login', (req,res) => {
  res.render('login', {
    error: 'Please Log In'
  })
})

router.get('/signup', (req,res) => {
  res.render('signup',{
    email: ''
  })
})

router.post('/login', (req,res) => {
  const email = req.body.email
  const password = req.body.password
  db.authenticateUser(email, password)
    .then(userId => {
      if(userId){
        req.session.userId = userId
        res.redirect('/')
      }else{
        res.render('login', {
          error: 'Email or Password Not Found'
        })
      }
    })
    .catch(error => {
      res.render('error', {
        error: error,
      })
    })
})

router.post('/signup', (req,res) => {
  const attributes = req.body.user
  const email = attributes.email
  const password = attributes.password
  const password_confirmation = attributes.password_confirmation
    if(password !== '' && password !== password_confirmation){
      res.render('signup', {
        error: 'Passwords Do Not Match',
        email: email,
      })
    } else{
      db.createUser(attributes)
        .then(user => {
          req.session.userId = user.id
          res.redirect('/')
        })
        .catch(error => {
          res.render('index', {
            error: error,
            email: email,
          })
        })
    }
})

router.get('/logout', (req,res) => {
  req.session = null
  res.redirect('/')
})

router.use('/users', users)

module.exports = router
