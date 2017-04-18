
module.exports = mongoose => {
  const SocketSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId,  unique: true, required: true },
    socket_id: { type: String, required: true },
    created_at: { type: String, required: true },
  });

  return mongoose.model('Socket', SocketSchema);
}