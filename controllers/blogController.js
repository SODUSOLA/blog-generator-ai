import dotenv from 'dotenv';
dotenv.config();

import Blog from '../models/Blogs.js';
import axios from 'axios';
import { marked } from 'marked';
import { GoogleGenAI } from '@google/genai';
import { downloadAndUploadAudio } from '../utils/downloadAndUploadAudio.js';


const assemblyApiKey = process.env.ASSEMBLYAI_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

export const generateBlog = async (req, res) => {
    const { audioUrl } = req.body;

    if (!audioUrl) {
        return res.status(400).json({ message: 'audioUrl is required' });
    }

    try {
        // Step 1: Submit audio to AssemblyAI
        const transcriptResponse = await axios.post(
            'https://api.assemblyai.com/v2/transcript',
            { audio_url: audioUrl },
            {
                headers: {
                    authorization: assemblyApiKey,
                    'content-type': 'application/json',
                },
            }
        );

        const transcriptId = transcriptResponse.data.id;

        // Step 2: Poll for transcript
        let transcriptText = '';
        let completed = false;
        let retries = 0;

        while (!completed && retries < 20) {
            retries++;
            const polling = await axios.get(
                `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
                { headers: { authorization: assemblyApiKey } }
            );

            if (polling.data.status === 'completed') {
                transcriptText = polling.data.text;
                completed = true;
            } else if (polling.data.status === 'error') {
                return res.status(500).json({
                    message: 'Transcription failed',
                    details: polling.data.error,
                });
            } else {
                await new Promise((r) => setTimeout(r, 3000));
            }
        }

        if (!completed || !transcriptText) {
            return res.status(408).json({ message: 'Transcript unavailable' });
        }

        // Step 3: Generate blog using Gemini
        const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a concise and professional blog post based on this transcript:\n\n${transcriptText}`,
        maxOutputTokens: 1500,
        temperature: 0.7,
        });

        const rawBlog = response.text;
        const blogHtml = marked(rawBlog);

        // Step 4: Save to DB
        const savedBlog = await Blog.create({
            user: req.user._id,
            audioUrl,
            transcript: transcriptText,
            blog: blogHtml,
        });

        res.status(200).json({
            blog: blogHtml,
            blogId: savedBlog._id,
            source: audioUrl,
            createdAt: savedBlog.createdAt,
        });

    } catch (err) {
        console.error('Gemini Blog Error:', err?.message || err);
        res.status(500).json({
            message: 'Failed to generate blog content',
            error: err?.message || 'Unknown error',
        });
    }
};

// Get blogs history for authenticated user
export const getUserBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch blogs' });
    }
};

// Start blog generation process from YouTube link
export const startBlogGeneration = async (req, res) => {
    const { youtubeLink } = req.body;

    if (!youtubeLink) {
        return res.status(400).json({ message: 'YouTube link is required' });
    }

    try {
        const audioUrl = await downloadAndUploadAudio(youtubeLink);
        res.status(200).json({ audioUrl }); // Now you can pass this to transcription
    } catch (error) {
        res.status(500).json({ message: 'Processing failed', error });
    }
};

// Delete a blog by ID
export const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user._id;

        const blog = await Blog.findOne({ _id: blogId, user: userId });
        if (!blog) {
        return res.status(404).json({ message: 'Blog not found or not authorized' });
        }

        await Blog.deleteOne({ _id: blogId });

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
        console.error('Delete Blog Error:', err);
        res.status(500).json({ message: 'Failed to delete blog' });
    }
};