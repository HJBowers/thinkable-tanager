const knex = require('./knex.js')

const insertRecord = (table, data) =>
  knex( table ).insert( data ).returning('*')

const insertUser = (data) =>
  insertRecord('users', data)

const retrieveRecord = (table, data) =>
  knex( table ).where( data ).select()

const retrieveUser = (data) =>
  retrieveRecord('users', data)

module.exports = { insertUser, retrieveUser }
