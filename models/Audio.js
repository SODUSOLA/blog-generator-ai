import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema({
    audioUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Audio', audioSchema);
