import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import cloudinary from '../services/cloudinary.js'; // Only this!
import Audio from '../models/Audio.js';


export const downloadAndUploadAudio = async (youtubeUrl) => {
    return new Promise((resolve, reject) => {
        const outputDir = path.join('downloads');
        const outputFile = path.join(outputDir, 'audio.mp3');

        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
        }

        const command = `yt-dlp -x --audio-format mp3 -o "${outputFile}" "${youtubeUrl}"`;

        exec(command, async (error, stdout, stderr) => {
        if (error) {
            console.error('yt-dlp error:', error.message);
            return reject('Download failed: ' + error.message);
        }

        if (stderr) console.warn('yt-dlp warning:', stderr);

        if (!fs.existsSync(outputFile)) {
            return reject('Download failed: audio file not found');
        }

        try {
            const result = await cloudinary.uploader.upload(outputFile, {
            resource_type: 'video',
            folder: 'blog-audio'
            });

            fs.unlinkSync(outputFile); // Clean up

            // ✅ Save to DB
            await Audio.create({
            audioUrl: result.secure_url
            });

            resolve(result.secure_url);
        } catch (uploadErr) {
            reject('Cloud upload failed: ' + uploadErr.message);
        }
        });
    });
    
    c
};
