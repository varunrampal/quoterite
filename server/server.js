const express = require('express');
const { join } = require('path');
//const winston = require('winston');
require('winston-mongodb');

const app = express();

// get environment variabless
require('dotenv').config({
    path: `${__dirname}/.env.${process.env.NODE_ENV}`,
});


app.use(express.static(join(__dirname, 'public')));

const buildPath = join(__dirname, '..', 'build');
app.use(express.static(buildPath));

require('./startup/logging')(); //logging setup
require('./startup/routes')(app);// Routes setup
require('./startup/db')();// database setup

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(join(__dirname+'/../build/index.html'));
// });

const port = process.env.PORT || 5000;
//const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

const server = app.listen(port, () => {
    console.log(`server started on port ${port}`);
  });

module.exports = server;
