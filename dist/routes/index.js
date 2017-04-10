'use strict';

var express = require('express');
var router = express.Router();
var users = require('./users');
var database = require('../database');
var moment = require('moment');

var renderTodoListPage = function renderTodoListPage(list, req, res) {
  Promise.all([req.getCurrentUser(), database.getAllTasksByUserId(req.session.userId)]).then(function (results) {
    var currentUser = results[0];
    var tasks = results[1];

    tasks = tasks.filter(function (task) {
      return list === 'all' || list === 'work' & task.is_work || list === 'personal' & !task.is_work;
    });

    res.render('profile', {
      currentUser: currentUser,
      tasks: tasks,
      newTask: {},
      humanizeDate: humanizeDate,
      list: list
    });
  }).catch(function (error) {
    res.render('error', {
      error: error
    });
  });
};

/* GET home page. */
router.get('/', function (req, res, next) {
  if (!req.loggedIn) {
    res.render('index');
    return;
  }
  renderTodoListPage('all', req, res);
});

router.get('/:list', function (req, res, next) {
  var list = req.params.list.toLowerCase();
  if (list === 'work') {
    return renderTodoListPage('work', req, res);
  }
  if (list === 'personal') {
    return renderTodoListPage('personal', req, res);
  }
  next();
});

var humanizeDate = function humanizeDate(date) {
  return moment(date).format('MMM Do YY');
};

router.get('/login', function (req, res) {
  res.render('login');
});

router.get('/signup', function (req, res) {
  res.render('signup', {
    email: ''
  });
});

router.post('/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  database.authenticateUser(email, password).then(function (userId) {
    if (userId) {
      req.session.userId = userId;
      res.redirect('/');
    } else {
      res.render('login', {
        error: 'Email or Password Not Found'
      });
    }
  }).catch(function (error) {
    res.render('error', {
      error: error
    });
  });
});

router.post('/signup', function (req, res) {
  var attributes = req.body.user;
  var email = attributes.email;
  var password = attributes.password;
  var password_confirmation = attributes.password_confirmation;
  var bio = attributes.bio;
  if (password !== '' && password !== password_confirmation) {
    res.render('signup', {
      error: 'Passwords Do Not Match',
      email: email
    });
  } else {
    database.createUser(attributes).then(function (user) {
      req.session.userId = user.id;
      res.redirect('/');
    }).catch(function (error) {
      res.render('index', {
        error: error,
        email: email
      });
    });
  }
});

router.get('/tasks/:taskId/delete', function (req, res) {
  database.deleteTask(req.params.taskId).then(function () {
    res.redirect('/');
  }).catch(function (error) {
    res.render('error', {
      error: error
    });
  });
});

var listToPath = function listToPath(list) {
  return !list || list === 'all' ? '/' : '/' + list;
};

router.get('/tasks/:taskId/uncomplete', function (req, res) {
  database.uncompleteTask(req.params.taskId).then(function () {
    res.redirect(listToPath(req.query.list));
  }).catch(function (error) {
    res.render('error', {
      error: error
    });
  });
});

router.get('/tasks/:taskId/complete', function (req, res) {
  database.completeTask(req.params.taskId).then(function () {
    res.redirect(listToPath(req.query.list));
  }).catch(function (error) {
    res.render('error', {
      error: error
    });
  });
});

router.post('/tasks', function (req, res) {
  var task = req.body.task;
  task.is_work = task.is_work === 'true';
  task.userId = req.session.userId;
  database.createTask(task).then(function (task) {
    res.redirect(listToPath(req.body.list));
  }).catch(function (error) {
    res.render('new_task_form', {
      error: error,
      newTask: task
    });
  });
});

router.post('/tasks/set-ranks', function (req, res) {
  var newRanks = req.body;
  database.setRanks(req.session.userId, newRanks).then(function (task) {
    res.send('');
  }).catch(function (error) {
    res.status(400).json({
      errorMessage: error.message,
      error: error
    });
  });
});

router.post('/tasks/:taskId', function (req, res) {
  var task = req.body.task;
  task.taskId = req.params.taskId;
  database.updateTask(task).then(function (task) {
    res.redirect(listToPath(req.body.list));
  }).catch(function (error) {
    res.render('error', {
      error: error
    });
  });
});

router.get('/logout', function (req, res) {
  res.redirect('/login');
});

router.use('/users', users);

module.exports = router;