module.exports = {
  isBearerAuthenticated(options = { session: false }) {
    return this.passport.authenticate('bearer', options);
  }
};