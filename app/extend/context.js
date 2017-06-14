
const BAR = Symbol('Context#bar');
module.exports = {
  get model() {
    return this.app.model;
  },

  get mongooses() {
    return this.app.mongooses;
  },

  get access_token() {
    const headers = this.headers;
    const authorization = headers.authorization;
    return authorization && authorization.split(' ').length > 1 && authorization.split(' ')[1];
  },

  error(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
  },
  async message(info, from, to) {
    const io = this.app.io;
    await this.service.notice.createMessage(info.content, from, to)
    const socketId = await this.service.socket.getSocketId(to);
    socket = io.sockets.sockets[socketId];

    socket.emit('message_response', info)
  },

  async reminder(info, to, save = true) {
    const io = this.app.io;
    let socket, message;
    if (save) {
      await this.service.notice.createReminder(info.content, to)
    }
    const socketId = await this.service.socket.getSocketId(to);
    socket = io.sockets.sockets[socketId];

    socket.emit('message_response', info)
  },
  announcement(info, from, to) {
    if (to) {
      to.forEach(item => {
        const socketId = this.service.socket.getSocketId(item);
        if (socketId) io.sockets.sockets[socketId].emit("message.response", info); 
      })
    } else {
      const io = this.app.io;
      io.emit('message_response', info)
    }
  }
};