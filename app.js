'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models');

const indexRouter = require('./routes');
const apiRouter = require('./routes/api');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));
// Set up express to handle req.body parsing
app.use(express.json());

// set up routes
app.use('/', indexRouter);
app.use('/api', apiRouter);



// 404 error handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  });
});

//  Global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  if(err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    const errors = err.errors.map(error => error.message);
    res.status(400).json({ errors }); 
  }
  res.status(err.status || 500).json({
    message: `Error ${err.status}: ${err.message}`,
    //error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// Test the database connection, sync, and listen on port 5000
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync();
    const server = app.listen(app.get('port'), () => {
      console.log(`Express server is listening on port ${server.address().port}`);
    }); 

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
