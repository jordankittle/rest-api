const express = require('express');
const router = express.Router();

// setup a friendly greeting for the root route
router.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the REST API project!',
    });
  });

//Test error route
router.get('/test-error', (req, res, next) => {
    const error = new Error('This is a test error');
    error.status = 500;
    next(error);
});

module.exports = router;