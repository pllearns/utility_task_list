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

const authenticateUser  = (email, password) => {
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

const createTask = (attributes) => {
  const sql = `
  INSERT INTO
    personal_tasks (user_id, task, sub_task, due_date, is_important, is_work )
  VALUES
    ($1, $2, $3, $4, $5, $6)
  RETURNING
    *
  `
  const variables = [
    attributes.userId,
    attributes.task,
    attributes.sub_task,
    attributes.due_date,
    attributes.is_important,
    attributes.is_work,
  ]
  return db.one(sql, variables)
}

module.exports = {
  pgp: pgp,
  db: db,
  authenticateUser: authenticateUser,
  createUser: createUser,
  getUserById: getUserById,
  createTask: createTask
}
