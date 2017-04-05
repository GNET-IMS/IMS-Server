module.exports = app => {
  class Client extends app.Service {
    async find(id) {
      const client = await this.ctx.model.client.findOne({id});
      return client;
    }
  }
  return Client;
};