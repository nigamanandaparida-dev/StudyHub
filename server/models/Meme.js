import mongoose from 'mongoose';

const memeSchema = new mongoose.Schema({
  title: { type: String },
  textContent: { type: String },
  postType: { type: String, enum: ['image', 'text'], default: 'image' },
  imageUrl: { type: String },
  publicId: { type: String }, // Cloudinary public_id (Optional for local)
  uploader: { type: String, required: true },
  uploaderName: { type: String },
  likes: [{ type: String }],
  replies: [{
    user: { type: String },
    userName: { type: String },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Meme', memeSchema);
