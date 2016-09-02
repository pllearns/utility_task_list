'use strict';
const bcrypt = require('bcrypt-nodejs')
const pgp = require('pg-promise')()
const connectionString = process.env.DATABASE_URL || `postgres://${process.env.USER}@localhost:5432/tasker`
const db = pgp(connectionString)

const getUserById = (userId) => {
  return db.one("SELECT * FROM users WHERE users.id=$1", [userId])
}

const createUser = (attributes) => {
  const sql = `
    INSERT INTO
      users (email, encrypted_password)
    VALUES
      ($1, $2)
    RETURNING
      *
    `
  const encrypted_password = bcrypt.hashSync(attributes.password)
  const variables = [
    attributes.email,
    encrypted_password,
  ]
  return db.oneOrNone(sql, variables)
}

const authenticateUser = (email, password) => {
  const sql = `
    SELECT
      id, encrypted_password
    FROM
      users
    WHERE
      email=$1
    LIMIT
      1
  `
  return db.oneOrNone(sql, [email])
    .then(user => {
      return user && bcrypt.compareSync(password, user.encrypted_password) ? user.id : null;
    })
}

const getNextRank = (userId) => {
  const sql = `
    SELECT
      MAX(rank)
    FROM
      tasks
    WHERE
      user_id=$1
  `
  return db.oneOrNone(sql, [userId])
    .then(result => {
      return (result.rank || 0) + 1
    })
}

const createTask = (attributes) => {
  return getNextRank(attributes.userId)
    .then(rank => {
      const sql = `
      INSERT INTO
        tasks (user_id, rank, task, sub_task, due_date, is_important, is_work )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        *
      `
      const variables = [
        attributes.userId,
        rank,
        attributes.task,
        attributes.sub_task,
        attributes.due_date,
        attributes.is_important,
        attributes.is_work,
      ]
      return db.one(sql, variables)
    })
}

const getAllTasksByUserId = (userId) => {
  const sql = `
  SELECT
    *
  FROM
    tasks
  WHERE
    user_id=$1
  ORDER BY
    rank ASC
  `
  const variables = [userId]
  return db.manyOrNone(sql, variables)
}

//change the ORDER BY to rank DESC

const deleteTask = (taskId) => {
  const sql = `
  DELETE FROM
    tasks
  WHERE
    id=$1
  `
  const variables = [taskId]
  return db.none(sql, variables)
}

const completeTask = (taskId) => {
  const sql = `
  UPDATE
    tasks
  SET
    is_complete=true
  WHERE
    id=$1
  `
  const variables = [taskId]
  return db.oneOrNone(sql, variables)
}

const uncompleteTask = (taskId) => {
  const sql = `
  UPDATE
    tasks
  SET
    is_complete=false
  WHERE
    id=$1
  `
  const variables = [taskId]
  return db.oneOrNone(sql, variables)
}

const updateTask = (attributes) => {
  const sql = `
    UPDATE
      tasks
    SET
      task=$1
    WHERE
      id=$2
  `
  const variables = [
    attributes.task,
    attributes.taskId,
  ]
  return db.none(sql, variables)
}

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
  updateTask: updateTask
}
