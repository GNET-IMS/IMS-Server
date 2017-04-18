module.exports = app => {
  class User extends app.Service {
    async create(target) {
      const user = new this.ctx.model.user(Object.assign({
        created_at: this.ctx.helper.currentTime(),
        is_admin: false,
        avatar_url: '/images/chh1.jpg',
      }, target))
      const result = await user.save();
      return result;
    }
    async batchCreate(targets) {
      const { ctx } = this;
      const { helper } = ctx;
      const doc = await ctx.model.user.collection.insert(targets.map(item => {
        item.is_admin = false;
        item.created_at = helper.currentTime();
        item.password = helper.hashEncodeSync(item.password);
        return item;
      }))
      if (doc.result.ok) {
        if (targets.length == doc.result.n) return true;
      }
      return false;
    }
    async find(id) {
      const user = await this.ctx.model.user.findOne({ _id: id });
      return user;
    }
    async remove(id) {
      const doc = await this.ctx.model.user.remove({ _id: id });
      if (doc.result.ok) {
        if (doc.result.n) return true;
        throw this.ctx.error('该用户不存在');
      }
      throw this.ctx.error('删除出错');
    }
    async update(target) {
      const user = await this.ctx.model.user.findById({ _id: target._id });
      if (user) {
        for (let key in target) {
          user[key] = target[key];
        }
        const doc = await user.save();
        return doc;
      }
      return undefined;
    }
    async search(query) {
      const result = await this.ctx.helper.search(query, this.ctx.model.user);
      return result;
    }
  }
  return User;
};