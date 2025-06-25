import express from 'express';
import { generateBlog, getUserBlogs, deleteBlog } from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog generation and management
 */

/**
 * @swagger
 * /blog/generate:
 *   post:
 *     summary: Generate a blog post from audio URL
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Audio URL for transcription and blog generation
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - audioUrl
 *             properties:
 *               audioUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://res.cloudinary.com/example/audio.mp3"
 *     responses:
 *       200:
 *         description: Blog generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blog:
 *                   type: string
 *                 blogId:
 *                   type: string
 *                 source:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing audioUrl
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error or generation failure
 */
router.post('/generate', protect, generateBlog);

/**
 * @swagger
 * /blog/history:
 *   get:
 *     summary: Get blogs history for authenticated user
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   source:
 *                     type: string
 *                   transcript:
 *                     type: string
 *                   blog:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error fetching blogs
 */
router.get('/history', protect, getUserBlogs);

/**
 * @swagger
 * /blog/history/{id}:
 *   delete:
 *     summary: Delete a blog by ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Blog ID to delete
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.delete('/history/:id', protect, deleteBlog);

export default router;
