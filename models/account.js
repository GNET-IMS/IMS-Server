// Load required packages
var mongoose = require('mongoose');

// Define our account schema
var AccountSchema   = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  username: { type: String, required: false },
  password: { type: String, required: true },
  createDate: { type: String, required: true },
});

// Export the Mongoose model
module.exports = mongoose.model('Account', AccountSchema);
