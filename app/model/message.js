
module.exports = mongoose => {
  const MessageSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId },
    to: { type: mongoose.Schema.Types.ObjectId },
    type: { type: String, required: true },
    content: { type: String, required: true },
    title: { type: String, required: true },
    is_read: { type: Boolean, required: true },
    created_at: { type: String, required: true },
  });

  return mongoose.model('Message', MessageSchema);
}