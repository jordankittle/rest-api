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
    const error = new Error('This is a changed test error');
    error.status = 500;
    next(error);
});

// Test SequelizeUniqueConstraintError route
router.get('/test-constraint-error', (req, res, next) => {
    const error = new Error('This is a unique constraint test error');
    error.name = "SequelizeUniqueConstraintError";
    const errors = [];
    const testError = new Error('This is a test SequelizeUniqueConstraintError');
    const testError1 = new Error('This is a test for one thing that went wrong');
    const testError2 = new Error('This is a test for the second thing that went wrong');
    const testError3 = new Error('This is a test for the third thing that went wrong');
    errors.push(testError, testError1, testError2, testError3);
    error.errors = errors;
    
    next(error);
});

module.exports = router;