module.exports = app => {
  class Message extends app.Service {
    async create(target) {
      const message = new this.ctx.model.message(Object.assign({
        is_read: false,
        created_at: this.ctx.helper.currentTime(),
      }, target))
      const result = await message.save();
      return result;
    }
    async find(id) {
      const message = await this.ctx.model.message.findOne({ _id: id });
      return message;
    }
    async search(query) {
      const result = await this.ctx.helper.search(query, this.ctx.model.message);
      return result;
    }
    async remove(id) {
      const doc = await this.ctx.model.message.remove({ _id: id });
      if (doc.result.ok) {
        if (doc.result.n) return true;
        throw this.ctx.error('该消息不存在');
      }
      throw this.ctx.error('删除出错');
    }
    async read(id) {
      const doc = await this.ctx.model.message.update({ _id: id }, { is_read: true });
      return doc;
    }
  }
  return Message;
};