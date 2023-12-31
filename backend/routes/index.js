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


//Static routes
//Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  //Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, '../../frontend', 'build', 'index.html')
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/build")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(
      path.resolve(__dirname, '../../frontend', 'build', 'index.html')
    );
  });

  // Add a XSRF-TOKEN cookie in development
  if (process.env.NODE_ENV !== 'production') {
    router.get('/api/csrf/restore', (req, res) => {
      res.cookie('XSRF-TOKEN', req.csrfToken());
      return res.json({});
    });
  }
}

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
