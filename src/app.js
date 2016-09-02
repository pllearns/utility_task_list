var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser')
var database = require('./database')
var routes = require('./routes')
var connect = require('connect')
var gravatar = require('gravatar')
var bootstrap = require("express-bootstrap-service")

var app = express()

app.get('env') === process.env.NODE_ENV || 'development'
  // view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('trust proxy', 1)

app.set('port', (process.env.PORT || 3000))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bootstrap.serve)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieSession({
  name: 'session',
  keys: [
    'd96a5bad00f0f5bbfa7fa03ba42bab02a229ebd69',
    '09b75924af0e502cd1fad019ac6efdade87971019'
  ]
}))
app.use((req, res, next) => {
  req.loggedIn = !!req.session.userId
  res.locals.loggedIn = req.loggedIn
  req.getCurrentUser = function() {
    if (req.loggedIn) {
      return database.getUserById(this.session.userId)
        .then(user => {
          user.avatar_url = gravatar.url(user.email)
          res.locals.currentUser = user
          return user
        })
    } else {
      res.locals.currentUser = null
      return Promise.resolve(null)
    }
  }
  next()
})

app.use('/', routes)
app.use('/users', routes)

app.get('/signup', routes)
app.post('/signup', routes)
app.delete('/tasks/:id', routes)
  // app.delete('/users/:id', routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404;
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

app.listen(app.get('port'), () => {
  console.log('Example app listening on port 3000!')
})

module.exports = app
