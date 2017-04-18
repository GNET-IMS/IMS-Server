'use strict';

//app.isBearerAuthenticated()
module.exports = app => {
  app.resources('users', '/api/users', app.isBearerAuthenticated(), 'users');
  app.post('/api/users/:id/upload', app.isBearerAuthenticated(), 'users.uploadPhoto');

  app.resources('messages', '/api/messages', app.isBearerAuthenticated(), 'message');
  app.put('/api/messages/:id/read', app.isBearerAuthenticated(), 'message.read');

  app.io.route('init', app.io.controllers.init);
};
