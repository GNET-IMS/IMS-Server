// Load required packages
var mongoose = require('mongoose');
var RefreshToken = require('./refreshToken');
var { token_expires_in } = require('../app.cfg');

// Define our token schema
var accessTokenSchema   = new mongoose.Schema({
  value: { type: String, unique: true, required: true },
  userId: { type: String, required: false },
  clientId: { type: String, required: true },
  scope: { type: String, required: false },
  createAt: { type: Date, expires: token_expires_in },
  expiration: { type: Number, required: false },
});

accessTokenSchema.pre('save', function(callback) {
  this.sessionActivity = new Date();  // update the value every time you call .save()
  
  var now = new Date();
  var token = this;
  token.expiration = token_expires_in * 1000 + now.getTime();
  token.createAt = now;

  callback();
})

accessTokenSchema.methods.findRefresh = function(refresh, cb) {
  RefreshToken.findOne({value: refresh}, function(err, refreshToken) {
    if (err) return cb(err);
    return cb(null, refreshToken);
  })
}

// Export the Mongoose model
module.exports = mongoose.model('accessToken', accessTokenSchema);