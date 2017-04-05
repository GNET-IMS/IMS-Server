
module.exports = mongoose => {
  const RefreshTokenSchema = new mongoose.Schema({
    value: { type: String, required: true },
    token: { type: String, required: true },
    userId: { type: String, required: true },
    clientId: { type: String, required: true },
    scope: { type: String, required: true },
  });
  return mongoose.model('RefreshToken', RefreshTokenSchema);
}