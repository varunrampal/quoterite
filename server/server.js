const express = require('express');
const { join } = require('path');
require('winston-mongodb');
const app = express();
const HttpError = require('./helpers/http-error');

// get environment variabless
// require('dotenv').config({
//     path: `${__dirname}/.env.${process.env.NODE_ENV}`,
// });

//app.use(express.static(join(__dirname, 'public')));

// const buildPath = join(__dirname, '..', 'build');
// app.use(express.static(buildPath));

// Serve the static files from the React app
app.use(express.static(join(__dirname, '../build')));

require('./startup/logging')(); //logging setup
require('./startup/routes')(app); // Routes setup
require('./startup/db')(); // database setup

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(join(__dirname + './build/index.html'));
// });
// app.use((req, res, next) => {
//     res.sendFile(join(__dirname, "..", "build", "index.html"));
//   });
// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
     // res.sendFile(join(__dirname + '/../build/index.html'));
     
   //  res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(join(__dirname, "..", "build", "index.html"));
 });

 // handle 404 error(route not found)
 app.use((req, res, next) => {
     const error = new HttpError('Could not find this route.', 404);
     console.log('route not found');
     throw error;
 });
const port = process.env.PORT || 5000;
//const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

const server = app.listen(port, () => {
    console.log(`server started on port ${port}`);
});

module.exports = server;
