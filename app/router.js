'use strict';

//app.isBearerAuthenticated()
module.exports = app => {
  app.resources('users', '/api/users', app.isBearerAuthenticated(), 'users');
  app.post('/api/users/:id/upload', app.isBearerAuthenticated(), 'users.uploadPhoto');
  app.get('/api/user', app.isBearerAuthenticated(), 'users.getByToken');
  app.get('/api/users/:id/messages/unread_number', app.isBearerAuthenticated(), 'users.getUnreadMessageNum');

  app.resources('messages', '/api/messages', app.isBearerAuthenticated(), 'message');
  app.put('/api/messages/:id/read', app.isBearerAuthenticated(), 'message.read');
  app.get('/api/messages/unread_number', app.isBearerAuthenticated(), 'message.getUnreadNum')

  app.io.route('init', app.io.controllers.init);
};
