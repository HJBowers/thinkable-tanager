const express = require( 'express' );
const router = express.Router();
const db = require( '../database/db.js' )

const authHelpers = require('../auth/_helpers');
const passport = require('../auth/local');

router.get( '/', function ( req, res, next ) {
  res.render( 'signup' );
});

router.post('/signup', function ( req, res, next ) {
  return authHelpers.createUser(req, res)
    .then( (response) => {
              console.log('got to line 15ish', response);
      passport.authenticate('local', (err, user, info) => {
        console.log('got to line 17ish', response);
        req.session.user = response[0]
        if (response[0]) { res.redirect( '/game' ) }
      })(req, res, next)
    })
    .catch((err) => { console.log('there is an error adding a user', err); })
  // let { user_name, password } = req.body

  // db.insertUser({ user_name: user_name, password: password })
  //   .then( user => res.redirect( '/game' ) )
});

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('index', { title: 'Rainbow Super Attack Happy Fun Time' });
});

router.post('/login', function ( req, res, next ) {
  let { user_name, password } = req.body

  db.retrieveUser( { user_name: user_name } )
    .then( user => {
      if ( user[0] ) {
        if ( user[0].password === password ) {
          req.session.user = user[0]
          res.redirect('/game')
        }
        else {
          res.send('wrong password you, but')
        }
      }
      else {
        res.send('nihilism')
      }
    })
});

module.exports = router;
