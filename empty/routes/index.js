const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next){
  res.render('game', { title: 'Rainbow Super Attack Happy Fun Time' });
})

router.get('/game', function(req, res, next) {
  console.log('USERUSERUSER', req.session.user);
  res.render('game', { title: 'Rainbow Super Attack Happy Fun Time' });
});

module.exports = router;
