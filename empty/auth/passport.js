const passport = require('passport');
const knex = require('../database/knex');
const LocalStrategy = require('passport-local').Strategy;
const authHelpers = require('./_helpers');

module.exports = () => {

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    knex('users').where({id}).first()
    .then((user) => { done(null, user); })
    .catch((err) => { done(err,null); });
  });

  passport.use(new LocalStrategy( {usernameField: 'user_name', passwordField: 'password'}, (user_name, password, done) => {
    // check to see if the username exists
    knex('users').where({ user_name }).first()
    .then((user) => {
      console.log('user', user);
      if (!user) return done(null, false);
      console.log('comparePass', !authHelpers.comparePass(password, user.password));
      if (!authHelpers.comparePass(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
    .catch((err) => { return done(err); });
  }));

};
