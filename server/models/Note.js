import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true }, // 'pdf', 'image', etc.
  publicId: { type: String }, // Cloudinary public_id (Optional for local)
  uploader: { type: String, required: true },
  uploaderName: { type: String },
  savedBy: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Note', noteSchema);
