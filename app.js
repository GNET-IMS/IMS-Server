const BearerStrategy = require('passport-http-bearer').Strategy;

// app.js
module.exports = app => {
  app.passport.use(new BearerStrategy({ passReqToCallback: true }, async (req, accessToken, done) => {
    try {
      const service = req.ctx.service;
      const token = await service.accessToken.find(accessToken);
      let target = {};
      if (token.userId != null) {
        const user = await service.user.find(token.userId);
        if (!user) throw new Error('用户不存在');
        target = user;
      } else {
        const client = await service.client.find(token.clientId);
        if (!client) throw new Error('客户端不存在');
        target = client;
      }
      done(null, target, { scope: '*' });
    } catch (err) {
      done(err, false)
    }
  }));
};