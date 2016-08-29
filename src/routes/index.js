var express = require('express')
var router = express.Router()
// var db = require('./database')

/* GET home page. */
router.get('/', (req, res, next) => {
  if(!req.loggedIn){
  res.render('index', { title: 'Express' });
  return;
})

router.get('/login', = (req,res) => {
  res.render('login', {
    error: 'Please Log In'
  })
})

router.get('/signup', = (req,res) => {
  res.render('signup',{
    email: ''
  })
})

router.post('/login', = (req,res) => {
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




module.exports = router
