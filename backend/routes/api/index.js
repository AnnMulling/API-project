const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewRouter = require('./reviews.js')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');

// Connect restoreUser middleware to the API router
router.use(restoreUser);

//Sign In, Delete
router.use('/session', sessionRouter);

//Sign Up, Create Cookies
router.use('/users', usersRouter);

//Spots route
router.use('/spots', spotsRouter);

//Review route
router.use('/reviews', reviewRouter);


//Front-end
// router.post('/test', (req, res) => {
//   res.json({
//     requestBody: req.body
//   })
// });



module.exports = router;



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
