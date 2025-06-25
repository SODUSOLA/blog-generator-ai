import Audio from '../models/Audio.js'; // Your Mongoose model for storing audio info
import { downloadAndUploadAudio } from '../utils/downloadAndUploadAudio.js';

export const getCloudAudioUrl = async (req, res) => {
    const { youtubeLink } = req.body;
    
    if (!youtubeLink) {
        return res.status(400).json({ message: 'YouTube link is required' });
    }

    try {
        const audioUrl = await downloadAndUploadAudio(youtubeLink);

        // Save audio record in DB
        const audio = await Audio.create({ audioUrl, uploadedAt: new Date() });

        res.status(200).json({ audioUrl, audioId: audio._id });
    } catch (error) {
        res.status(500).json({ message: 'Processing failed', error: error.toString() });
    }
    };

    export const getAllAudios = async (req, res) => {
    try {
        const audios = await Audio.find().sort({ uploadedAt: -1 });
        res.status(200).json(audios);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch audios', error: error.toString() });
    }
    };

    export const deleteAudio = async (req, res) => {
    try {
        const { id } = req.params;
        const audio = await Audio.findByIdAndDelete(id);
        if (!audio) {
        return res.status(404).json({ message: 'Audio not found' });
        }
        res.status(200).json({ message: 'Audio deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete audio', error: error.toString() });
    }
};
