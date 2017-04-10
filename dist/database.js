'use strict';

var bcrypt = require('bcrypt-nodejs');
var pgp = require('pg-promise')();
var connectionString = process.env.DATABASE_URL || 'postgres://' + process.env.USER + '@localhost:5432/tasker';
var db = pgp(connectionString);

var getUserById = function getUserById(userId) {
  return db.one("SELECT * FROM users WHERE users.id=$1", [userId]);
};

var createUser = function createUser(attributes) {
  var sql = '\n    INSERT INTO\n      users (email, encrypted_password, bio)\n    VALUES\n      ($1, $2, $3)\n    RETURNING\n      *\n    ';
  var encrypted_password = bcrypt.hashSync(attributes.password);
  var variables = [attributes.email, encrypted_password, attributes.bio];
  return db.oneOrNone(sql, variables);
};

var authenticateUser = function authenticateUser(email, password) {
  var sql = '\n    SELECT\n      id, encrypted_password\n    FROM\n      users\n    WHERE\n      email=$1\n    LIMIT\n      1\n  ';
  return db.oneOrNone(sql, [email]).then(function (user) {
    return user && bcrypt.compareSync(password, user.encrypted_password) ? user.id : null;
  });
};

var deleteUser = function deleteUser(userId) {
  var sql = '\n  DELETE FROM\n    users\n    *\n  WHERE\n    id=$1\n  ';
  var variables = [userId];
  return db.none(sql, variables);
};

var getNextRank = function getNextRank(userId) {
  var sql = '\n    SELECT\n      MAX(rank)\n    FROM\n      tasks\n    WHERE\n      user_id=$1\n  ';
  return db.oneOrNone(sql, [userId]).then(function (result) {
    return (result.rank || 0) + 1;
  });
};

var createTask = function createTask(attributes) {
  return getNextRank(attributes.userId).then(function (rank) {
    var sql = '\n      INSERT INTO\n        tasks (user_id, rank, task, sub_task, due_date, is_important, is_work)\n      VALUES\n        ($1, $2, $3, $4, $5, $6, $7)\n      RETURNING\n        *\n      ';
    var variables = [attributes.userId, rank, attributes.task, attributes.sub_task, attributes.due_date, attributes.is_important, attributes.is_work];
    return db.one(sql, variables);
  });
};

var getAllTasksByUserId = function getAllTasksByUserId(userId) {
  var sql = '\n  SELECT\n    *\n  FROM\n    tasks\n  WHERE\n    user_id=$1\n  ORDER BY\n    rank ASC\n  ';
  var variables = [userId];
  return db.manyOrNone(sql, variables);
};

//change the ORDER BY to rank DESC

var deleteTask = function deleteTask(taskId) {
  var sql = '\n  DELETE FROM\n    tasks\n  WHERE\n    id=$1\n  ';
  var variables = [taskId];
  return db.none(sql, variables);
};

var completeTask = function completeTask(taskId) {
  var sql = '\n  UPDATE\n    tasks\n  SET\n    is_complete=true\n  WHERE\n    id=$1\n  ';
  var variables = [taskId];
  return db.oneOrNone(sql, variables);
};

var uncompleteTask = function uncompleteTask(taskId) {
  var sql = '\n  UPDATE\n    tasks\n  SET\n    is_complete=false\n  WHERE\n    id=$1\n  ';
  var variables = [taskId];
  return db.oneOrNone(sql, variables);
};

var updateTask = function updateTask(attributes) {
  var sql = '\n    UPDATE\n      tasks\n    SET\n      task=$1\n    WHERE\n      id=$2\n  ';
  var variables = [attributes.task, attributes.taskId];
  return db.none(sql, variables);
};

var setRanks = function setRanks(userId, newRanks) {
  var queries = [];
  for (var taskId in newRanks) {
    queries.push(setRank(userId, taskId, newRanks[taskId]));
  }
  return Promise.all(queries);
};

var setRank = function setRank(userId, taskId, rank) {
  var sql = '\n    UPDATE\n      tasks\n    SET\n      rank=$1\n    WHERE\n      id=$2\n    AND\n      user_id=$3\n  ';
  return db.none(sql, [rank, taskId, userId]);
};

module.exports = {
  pgp: pgp,
  db: db,
  authenticateUser: authenticateUser,
  createUser: createUser,
  getUserById: getUserById,
  createTask: createTask,
  getAllTasksByUserId: getAllTasksByUserId,
  deleteTask: deleteTask,
  completeTask: completeTask,
  uncompleteTask: uncompleteTask,
  updateTask: updateTask,
  deleteUser: deleteUser,
  setRanks: setRanks,
  setRank: setRank
};