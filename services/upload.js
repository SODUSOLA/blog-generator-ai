import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    });

// Path to local MP3 file
const filePath = path.join(__dirname, 'An Apple a Day： Discover 10 Health Benefits That Will Amaze You! [vpDWkrU77ps].mp3');

async function uploadAudio() {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video', // treat audio as video
        folder: 'blog-audio',
        });

        console.log('Uploaded successfully!');
        console.log('File URL:', result.secure_url);
    } catch (error) {
        console.error('Upload failed:', error.message);
    }
    }

uploadAudio();
