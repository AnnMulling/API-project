const express = require('express');
const router = express.Router();
const apiRouter = require('./api');

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });

  router.use('/api', apiRouter);
  module.exports = router;



  
//   fetch('/api/test', {
//     method: "POST",
//     headers: {
//         "Content-Type" : "application/json",
//         "XSRF-TOKEN": "h4jNQc3J-leXQUSuEfwtkv7QzCgraB0e1Ug0"
//     },
//     body: JSON.stringify({hello: 'world'})
//   }).then(res => res.json()).then(data => console.log(data))
//"EqqJXjyX--dJVFr9q82DusVOc8O3TQcAmMVo"
