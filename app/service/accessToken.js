module.exports = app => {
  class AccessToken extends app.Service {
    async findUserByAccessToken(token) {
      const resp = await this.ctx.curl('https://localhost:3000/api/userinfo', {
          headers: {
              Authorization: `bearer ${token}`,
          },
          dataType: 'json'
      })
      if (resp.status !== 200) {
          let error = new Error(resp.data);
          error.status = resp.status;
          throw error;
      } 
      return resp.data.user;
    }
  }
  return AccessToken;
};