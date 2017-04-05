module.exports = {
  isBearerAuthenticated() {
    return this.passport.authenticate('bearer', { session: false });
  }
};