const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/login',
function (req, res) {
  res.render('user/login')
}) 

router.post('/login',
passport.authenticate(
  'local',
  {
    failureRedirect: '/user/login',
  },
),
function (req, res) {
  res.redirect('/')
})

module.exports = router;