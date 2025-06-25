import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // youtubeLink: { type: String, required: true },
    audioUrl: { type: String, required: true },
    transcript: { type: String },
    blog: { type: String },
    createdAt: { type: Date, default: Date.now }
    });

export default mongoose.model('Blog', blogSchema);
