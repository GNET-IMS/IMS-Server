// Load required packages
var passport = require('passport');
var request = require('request');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var db = require('../db');
var config = require('../app.cfg');
var validate = require('../validate');


/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy((username, password, callback) => {
  const basicAuth = new Buffer(`${config.client.clientID}:${config.client.clientSecret}`).toString('base64');
  request.post('https://localhost:3000/oauth/token', {
    form: {
      username,
      password,
      grant_type: 'password',
      scope: 'offline-access',
    },
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }, (error, response, body) => {
    const { access_token, refresh_token, expires_in } = JSON.parse(body);
    if (response.statusCode === 200 && access_token) {
      // TODO: scopes
      const expirationDate = expires_in ? new Date(Date.now() + (expires_in * 1000)) : null;
      db.accessTokens.save(access_token, expirationDate, config.client.clientID)
        .then(() => {
          if (refresh_token != null) {
            return db.refreshTokens.save(refresh_token, config.client.clientID);
          }
          return Promise.resolve();
        })
        .then(done(null, { accessToken: access_token, refreshToken: refresh_token }))
        .catch(() => done(null, false));
    }
  });
}));

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
passport.use(new BasicStrategy(
  function (username, password, callback) {
    Client.findOne({ id: username }, function (err, client) {
      if (err) { return callback(err); }

      // No client found with that id or bad password
      if (!client || client.secret !== password) { return callback(null, false); }

      // Success
      return callback(null, client);
    });
  }
));

passport.use(new ClientPasswordStrategy(
  function (clientId, clientSecret, done) {
    Client.findOne({ id: clientId }, function (err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
      if (client.secret != secret) { return done(null, false); }
      return done(null, client);
    });
  }
));

passport.use(new BearerStrategy((accessToken, done) => {
  db.accessTokens.find(accessToken)
  .then(token => validate.token(token, accessToken))
  .then(token => done(null, token, { scope: '*' }))
  .catch(() => done(null, false));
}));

var isAuthenticated = passport.authenticate(['local', 'bearer'], { session: false });
exports.isAuthenticated = isAuthenticated;
exports.isClientAuthenticated = passport.authenticate('basic', { session: false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });

exports.isAppAuthenticated = [
  isAuthenticated,
  function (req, res, next) {
    if (req.authInfo.expiration < new Date().getTime()) {
      res.sendStatus(401);
    } else if (!req.authInfo || !req.authInfo.scope || req.authInfo.scope !== '*' && req.authInfo.scope.indexOf(scope) == -1) {
      res.sendStatus(403);
    } else {
      next();
    }
  }
];
