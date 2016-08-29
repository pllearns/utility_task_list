'use strict';
const bcrypt = require('bcrypt-nodejs')
const pgp = require('pg-promise')()
const connectionString = process.env.DATABASE_URL || `postgres://${process.env.USER}@localhost:5432/utility_task_list`
const db = pgp(connectionString)

const getUserById = (userId) => {
  return db.one("select * from users wheer users.id=$1", [userId])
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

module.exports = {
  pgp: pgp,
  db: db,
  authenticateUser: authenticateUser,
  createUser: createUser,
  getUserById: getUserById
}
