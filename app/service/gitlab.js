const gitlab = require('gitlab')({
  url: 'http://10.32.49.121',
  token: 'cooHFnypxf57Bpqhm5XJ'
});

module.exports = app => {
  class Gitlab extends app.Service {
    create(user, creator) {
      const result = new Promise((resolve, reject) => {
        try {
          gitlab.users.create({
            name: user.name,
            username: user.username,
            password: 123456,
            email: user.email,
          }, data => {
            this.ctx.messaage({
              type: 'success',
              title: 'gitlab',
              content: `用户：${user.username}的gitlab账号创建成功， 默认账号为当前账号，密码为：123456`,
            }, creator);
            resolve(data);
          });
        } catch (err) {
          this.ctx.messaage({
            type: 'error',
            title: 'gitlab',
            content: err.message,
          }, creator);
          reject(err);
        }
      })
      return result;
    }
    index() {
      const result = new Promise((resolve, reject) => {
        gitlab.users.all(data => {
          resolve(data);
        })
      })
      return result;
    }
  }
  return Gitlab;
}
