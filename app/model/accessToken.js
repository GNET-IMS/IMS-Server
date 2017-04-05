const token_expires_in = 60 * 60 // 1h;

module.exports = mongoose => {
  const accessTokenSchema = new mongoose.Schema({
    value: { type: String, unique: true, required: true },
    userId: { type: String, required: false },
    clientId: { type: String, required: true },
    scope: { type: String, required: false },
    createAt: { type: Date, expires: token_expires_in },
    expiration: { type: Number, required: false },
  });
  return mongoose.model('accessToken', accessTokenSchema);
}
