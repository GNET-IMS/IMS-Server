'use strict';

//app.isBearerAuthenticated()
module.exports = app => {
  app.resources('users', '/api/users', app.isBearerAuthenticated(), 'users');
  app.post('/api/users/:id/upload', 'users.uploadPhoto');
  
};
