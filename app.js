
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import express from 'express';
import cors from 'cors';
import blogRoutes from '../routes/blogRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import audioRoutes from './routes/audioRoutes.js';
import mongoose from 'mongoose';
import { setupSwagger } from './swagger.js';



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ Mongo error:', err));


// Initialize Express app
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/blog', blogRoutes); // blog route
app.use('/api/auth', authRoutes); // auth route
app.use('/api/audio', audioRoutes); // audio route

// API endpoint 
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello from Blog Generator API!');
});

// Setup Swagger for API documentation
setupSwagger(app);

// Start the server
app.listen(PORT, () => console.log(`✅ Server running → http://localhost:${PORT}`));

