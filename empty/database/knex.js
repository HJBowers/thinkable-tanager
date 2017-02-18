
 const knex = require('knex') ({
  client: "pg",
  connection: {
    host: process.env.PG_CONNECTION_STRING,
    user: process.env.USER,
    database: 'flappybase'
  },
  searchPath: 'knex, public'
})

module.exports = knex
