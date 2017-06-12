/**
 * 聊天请求
 * chat_request      
 * chat_response
 * 
 * 消息请求
 * message_request
 * message_response
 * 
 */
module.exports = app => {
  return function* () {
    const payload = this.args[0];
    const mid = payload.mid;
    const chatMessage = yield this.service.chatMessage.create({
      content: payload.content,
      receiver_id: payload.receiver_id,
      sender_id: payload.sender_id,
      is_read: payload.is_read,
      chat_room_id: payload.chat_room_id
    });
    this.socket.emit('chat_response', payload);
    const socketId = yield this.service.socket.getSocketId(payload.receiver_id);
    if (socketId) {
      app.io.sockets.sockets[socketId] ? 
        app.io.sockets.sockets[socketId].emit('chat_response', chatMessage) : ''
    }
  };
};