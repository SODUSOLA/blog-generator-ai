import express from 'express';
import { getCloudAudioUrl, getAllAudios, deleteAudio } from '../controllers/audioController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Audio
 *   description: Audio upload and management endpoints
 */

/**
 * @swagger
 * /audio/upload:
 *   post:
 *     summary: Upload audio to cloud storage
 *     tags: [Audio]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - youtubeLink
 *             properties:
 *               youtubeLink:
 *                 type: string
 *                 description: URL of the YouTube video to extract audio from
 *     responses:
 *       200:
 *         description: Audio uploaded successfully with URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 audioUrl:
 *                   type: string
 *                   description: Cloud storage URL of the uploaded audio
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Server error during processing
 */
router.post('/upload', getCloudAudioUrl); // Upload audio from YouTube link

/**
 * @swagger
 * /audio/upload:
 *   get:
 *     summary: Get list of uploaded audios
 *     tags: [Audio]
 *     responses:
 *       200:
 *         description: List of uploaded audios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   audioUrl:
 *                     type: string
 *                   uploadedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/upload', getAllAudios); // Get all uploaded audios

/**
 * @swagger
 * /audio/upload/{id}:
 *   delete:
 *     summary: Delete an uploaded audio by ID
 *     tags: [Audio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Audio ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audio deleted successfully
 *       404:
 *         description: Audio not found
 *       500:
 *         description: Server error
 * 
 */
router.delete('/upload/:id', deleteAudio); // Delete audio by ID


export default router;
