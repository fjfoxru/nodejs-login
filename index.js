const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
const {Users} = require('./models');


const UrlDB = `mongodb+srv://nodejs-mongo-admin:qwe321QWE321@cluster0.jsjpu.mongodb.net/qwe321QWE321?retryWrites=true&w=majority`

const loggerMiddleware = require('./middleware/logger');
const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const booksApiRouter = require('./routes/api/books');
const userApiRouter = require('./routes/api/user');
const booksRouter = require('./routes/books');
const userRouter = require('./routes/user');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(loggerMiddleware);

app.use('/files', express.static(__dirname+'/public'));


function verify (username, password, done) {
    Users.findOne({username}, function (err, user) {
      if (err) { return done(err) }
      if (!user) { return done(null, false) }
  
      if (!user.verifyPassword(password)) { return done(null, false) }
      return done(null, user)
    })
  }
  const options = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: false,
  }
  passport.use('local', new LocalStrategy(options, verify));

  passport.serializeUser(function (user, cb) {
    cb(null, user.id)
  })
  
  passport.deserializeUser(function (id, cb) {
    Users.findById(id, function (err, user) {
      if (err) { return cb(err) }
      cb(null, user)
    })
  })

  app.use(require('express-session', { secret: 'somevalue' })({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  }))

  app.use(passport.initialize())
  app.use(passport.session())

app.use('/', indexRouter);
app.use('/api/books', booksApiRouter);
app.use('/api/user', userApiRouter);
app.use('/books', booksRouter);
app.use('/user', userRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await mongoose.connect(UrlDB);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }}
    start();