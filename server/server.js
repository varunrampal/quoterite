const express = require('express');
const { join } = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { json, urlencoded } = express;
//const winston = require('winston');
require('winston-mongodb');
const winston = require('winston');
const mongoose = require('mongoose');
const {DB_CONNECTION_STRING} = require('./utils/constants');
const {JWT_KEY} = require('./utils/constants');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('./models/user');
const { success, error } = require('./helpers/api-response');
const app = express();


// get environment variabless
// require('dotenv').config({
//     path: `${__dirname}/.env.${process.env.NODE_ENV}`,
// });


//app.use(express.static(join(__dirname, 'public')));

const buildPath = join(__dirname, '..', 'build');
app.use(express.static(buildPath));

app.get('/jobs', async (req, res) => {
  try {
    res.send({status: 'good'});
  } catch (error) {
    res.status(400).send('Error while getting list of jobs.Try again later.');
  }
});

//require('./startup/logging')(); //logging setup
//require('./startup/routes')(app);// Routes setup
//require('./startup/db')();// database setup

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(join(__dirname+'/../build/index.html'));
// });

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
 app.use(json());
 app.use(
     urlencoded({
         extended: false,
     })
 );
 app.use(cookieParser());

 app.use(cors());

 // routes declaration
 //app.use('/api/user', usersRoutes); // => /api/user...

 mongoose
 .connect(DB_CONNECTION_STRING, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useFindAndModify: false,
 })
 .then(() => winston.info('Connected to MongoDB...'))
 .catch((err) => {
     console.log(err);
 });

// @route POST /user/login
// @desc to authenticate user, returns userid, email and token
// @access Public
app.post('/api/user/login', async (req, res, next) => {
  const { email, password } = req.body;

  // check if user with the provided email-id exists
  let existingUser;

  existingUser = await User.findOne({
      email: email,
      active: 1
  });

  //user not exists with the provide email-id
  if (!existingUser) {
     
      return res.status(401).json(error("Invalid credentials.", res.statusCode));
  }


  // check if provided password is correct( compare the password with the password saved in the database)
  let isValidPassword = false;

  isValidPassword = await bcrypt.compare(password, existingUser.password);

  // Password is not valid
  if (!isValidPassword) {
   
      return res.status(401).json(error("Invalid credentials.", res.statusCode));
  }

  // generate token
  let token;

  token = jwt.sign(
      {
          userId: existingUser.id,
          email: existingUser.email,
      },
      //process.env.JWT_KEY,
      JWT_KEY,
      {
          expiresIn: '1h',
      }
  );

   res.status(200).json(
      success(
          'You are logged in successfully.',
          {
              userId: existingUser.id,
              userName: existingUser.name,
              userRole: existingUser.role,
              userEmail: existingUser.email,
              token: token,
          },
          res.statusCode
      )
  );
});



const port = process.env.PORT || 5000;
//const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

const server = app.listen(port, () => {
    console.log(`server started on port ${port}`);
  });

module.exports = server;
