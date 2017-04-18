module.exports = app => {
  class Socket extends app.Service {
    async create(target) {
      const socket = new this.ctx.model.socket(Object.assign({
        created_at: this.ctx.helper.currentTime(),
      }, target))
      const result = await socket.save();
      return result;
    }
    async update(target) {
      const socket = await this.ctx.model.socket.update(target);
      return socket;
    }
    async createOrUpdate(target) {
      const userId = target.user_id;
      const socket = await this.ctx.model.socket.findOne({ user_id: userId });
      if (socket) {
        return await this.update(Object.assign(socket, target));
      } else {
        return await this.create(target);
      }
    }
    async getSocketId(userId) {
      const socket = await this.ctx.model.socket.findOne({ user_id: userId });
      return socket && socket.socket_id;
    }
  }
  return Socket;
};