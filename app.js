import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
mongoose.Promise = Promise;
import session from 'express-session';
import passport from 'passport';
import log from './log';

import index from './routes/index';
import users from './routes/users';

import userController from './controllers/user';
import authController from './controllers/auth';
import oauth2Controller from './controllers/oauth2';
import clientController from './controllers/client';
import appRouter from './router';
import login from './controllers/login';

const app = express();

// Connect to the vipshare MongoDB
mongoose.connect('mongodb://localhost:27017/IMS');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use express session support since OAuth2orize requires it
app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
}));  

// Use the passport package in our application
app.use(passport.initialize());

// Create our Express router
const router = express.Router();

// Create endpoint handlers for /users
router.route('/users')
  .post(authController.isBearerAuthenticated, userController.postUsers)
  .get(authController.isBearerAuthenticated, userController.getUsers)

// Create endpoint handlers for /clients
router.route('/clients')
  .post(authController.isAuthenticated, clientController.postClients)
  .get(authController.isAuthenticated, clientController.getClients);

// Create endpoint handlers for oauth2 authorize
router.route('/oauth2/authorize')
  .get(authController.isClientAuthenticated, oauth2Controller.authorization)
  .post(authController.isClientAuthenticated, oauth2Controller.decision);

// Create endpoint handlers for oauth2 token
router.route('/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);

// Register app router
appRouter(router, authController);

// Register log record
log.use(app);

// Register all our routes with /api
app.use('/api', router);

const loginRouter = express.Router();
loginRouter.route('/login')
  .post(authController.isAuthenticated, login.getin)

app.use('', loginRouter);

// Handle 404
app.use(function(req, res) {
    res.status(404).json({ message: '亲，您是不是迷路了？' });
});

// Handle 500
app.use(function(error, req, res, next) {
    res.status(500).json({ message: '亲，不好的消息哦！', error });
});
module.exports = app;
