process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const BearerStrategy = require('passport-http-bearer').Strategy;

// app.js
module.exports = app => {
  
  app.passport.use(new BearerStrategy({ passReqToCallback: true }, async (req, accessToken, done) => {
    const resp = await req.ctx.curl(`https://localhost:3000/api/tokeninfo?access_token=${accessToken}`, {
      credentials: 'include',
    });
    if (resp.status !== 200) {
      const error = new Error('accessToken 失效');
      error.status = 401;
      done(error, false);
      return false;
    }
    done(null, {});
  }));
};