module.exports = app => {
  const table = 'sys_socket';
  class Socket extends app.Service {
    async create(target) {
      const date = this.ctx.helper.currentTime;
      const result = app.mysql.insert(table, Object.assign({
        create_date: date,
        modify_date: date
      }, target))
      return result.affectedRows === 1;
    }
    async update(target) {
      const socket = await app.mysql.update(table, target);
      return socket;
    }
    async createOrUpdate(target) {
      const userId = target.user_id;
      const socket = await app.mysql.get(table, { user_id: userId });
      if (socket) {
        return await this.update(Object.assign(socket, target));
      } else {
        return await this.create(target);
      }
    }
    async getSocketId(userId) {
      const socket = await app.mysql.get(table, { user_id: userId });
      return socket && socket.socket_id;
    }
    async removeBySocketId(id) {
      await app.mysql.delete(table, {socket_id: id});
    }
  }
  return Socket;
};