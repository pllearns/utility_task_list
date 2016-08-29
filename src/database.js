'use strict';
const bcrypt = require('bcrypt-nodejs')
const pgp = require('pg-promise')()
const connectionString = process.env.DATABASE_URL || `postgres://${process.env.USER}@localhost:5432/utility_task_list`
const db = pgp(connectionString)

const getUserById = () => {
  return db.one("")
}
