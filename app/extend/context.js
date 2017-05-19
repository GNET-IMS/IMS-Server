
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

  /**
   * socket.io 发送给空户端消息
   * @param {Object} info 
   * info: {
   *    type:  one of ['error', 'success', 'warn'] ,
   *    title: String,
   *    content: String,
   * }
   * @param {String} to 为空时表示发送给所有用户
   * @param {String} from 为空时表示系统发送的消息
   */
  async message(info, to, from, save = true) {
    const io = this.app.io;
    let socket, message;
    const data = {
      from,
      type: info.type,
      title: info.title,
      content: info.content,
    }

    if (to) {
      if (save) {
        message = await this.service.message.create(Object.assign(data, {
          to
        }));
      }
      const socketId = await this.service.socket.getSocketId(to);
      socket = io.sockets.sockets[socketId] && io.sockets.sockets[socketId].nsp;
    } else {
      if (save) {
        message = await this.service.message.create(data);
      }
      socket = io;
    }

    socket.emit('message_response', info)
  }
};