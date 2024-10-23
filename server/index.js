import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js'; // Ensure this is set up correctly

import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Adjust limit based on your needs

// Set up routes
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', async (req, res) => {
    res.send("Hello from imaginate!");
});

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL); // Ensure connectDB is async and returns a promise
        app.listen(8080, () => console.log('Server has started on port http://localhost:8080'));
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();
