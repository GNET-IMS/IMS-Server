module.exports = app => {
  const table = 'sys_chat_message';
  class ChatMessage extends app.Service {
    async create(target) {
      const date = this.ctx.helper.currentTime;
      const chatMessage = Object.assign({
        create_date: date,
        modify_date: date
      }, target);
      const result = await app.mysql.insert(table, chatMessage);
      return Object.assign({
        id: result.insertId,
      }, chatMessage)
    }
    async update(target) {
      const result = await app.mysql.update(table, target);
      return result.affectedRows === 1;
    }
    async remove(id) {
      const result = await app.mysql.delete(table, { id });
      return result.affectedRows === 1;
    }
    async search(query) {
      return await this.ctx.helper.pagination(table, Object.assign( query, {
        sorter: 'create_date',
        order: 'desc',
      }), app.mysql);
    }
  }
  return ChatMessage;
};