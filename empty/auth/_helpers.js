const bcrypt = require('bcryptjs');
const knex = require('../database/knex');

function comparePass(userPassword, databasePassword) {
  return bcrypt.compareSync(userPassword, databasePassword);
}

function createUser (req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return knex('users')
  .insert({
    user_name: req.body.user_name,
    password: hash
  })
  .returning('*');
}

module.exports = {
  comparePass,
  createUser
};
