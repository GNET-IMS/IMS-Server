const gitlab = require('gitlab')({
  url: 'http://10.32.49.121',
  token: 'cooHFnypxf57Bpqhm5XJ'
});

module.exports = app => {
  class Gitlab extends app.Service {
    async create(user) {
      const result = await new Promise((resolve, reject) => {
        try {
          gitlab.users.create({
            name: user.name,
            username: user.username,
            password: 123456,
            email: user.email,
          }, resolve);
        } catch (err) {
          reject(err);
        }
      })
      return result;
    }
  }
  return Gitlab;
}
