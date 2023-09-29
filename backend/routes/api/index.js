const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.post('/test', (req, res) => {
  res.json({
    requestBody: req.body
  })
});



module.exports = router;

//"9YEqd42K-FnQXSKMo1IxSY7VDHyQaCPzc6sc"

/*
 fetch('/api/session', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": "9YEqd42K-FnQXSKMo1IxSY7VDHyQaCPzc6sc"
  },
  body: JSON.stringify({credential: 'Demo-lition', password: 'password'})
 }).then(res => res.json()).then(data => console.log(data));


 fetch('/api/session', {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "XSRF-TOKEN": "lvMJa0xf-LhAiFo2wUqYSayEKdMW4dP234pU"
  },
  body: JSON.stringify({ credential: 'Demo-lition', password: 'password' })
}).then(res => res.json()).then(data => console.log(data));
 */
