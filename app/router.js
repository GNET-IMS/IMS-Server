'use strict';

//app.isBearerAuthenticated()
module.exports = app => {
  app.resources('user', '/api/users', app.isBearerAuthenticated(), 'user');
  app.post('/api/users/:id/upload', app.isBearerAuthenticated(), 'user.uploadPhoto');
  app.get('/api/user', app.isBearerAuthenticated(), 'user.getByToken');

  app.get('/api/users/:id/announcements', 'user.getAnnouncements');
  app.post('/api/users/:id/announcements', 'user.pullAnnouncements');
  app.delete('/api/users/:id/announcements/:announcement_id', 'user.removeAnnouncement');
  
  app.resources('announcements', '/api/announcements', 'announcement');

  app.resources('chatRooms', '/api/chat_rooms', 'chatRoom');

  app.resources('chatMessages', '/api/chat_messages', 'chatMessage');
  app.patch('/api/chat_messages', 'chatMessage.read');


  app.io.route('init', app.io.controllers.init);
  app.io.route('chat_request', app.io.controllers.chat);
};
