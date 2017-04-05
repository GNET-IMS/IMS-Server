'use strict';

//app.isBearerAuthenticated()
module.exports = app => {
  app.resources('users', '/api/users', 'users');
  app.post('/api/users/:id/upload', 'users.uploadPhoto');
  
};
