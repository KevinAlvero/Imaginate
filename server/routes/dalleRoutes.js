import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch'; 
dotenv.config();

const router = express.Router();

// Health check endpoint
router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

// Image generation endpoint
router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // New query function to use the updated model
    async function query(data) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: `<lora:dalle-3-xl-lora-v2:0.8> ${data.prompt}` }), // Include trigger word
        }
      );

      // Check for response status
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`API error: ${errorMessage}`);
      }

      const result = await response.blob(); // Fetch the image as a blob
      return result;
    }

    // Call the query function with the user-provided prompt
    const imageResponse = await query({ prompt });

    // Convert the blob to base64 to send it to the frontend
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    // Return the image in base64 format
    res.status(200).json({ photo: base64Image });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong during image generation: ' + error.message);
  }
});

export default router;
