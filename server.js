require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from the root directory

app.post('/generate-affirmation', async (req, res) => {
    const { text } = req.body;
    const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
    const API_URL = "https://api-inference.huggingface.co/models/prithivML/affirmation_generator"; // You can change this to a different model if needed

    if (!HUGGING_FACE_API_KEY) {
        return res.status(500).json({ error: "Hugging Face API key not configured." });
    }

    if (!text) {
        return res.status(400).json({ error: "No text provided for affirmation generation." });
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
            },
            body: JSON.stringify({ inputs: text }),
        });

        const result = await response.json();

        if (response.ok && result && result.length > 0 && result[0].generated_text) {
            res.json({ affirmation: result[0].generated_text });
        } else {
            console.error("Hugging Face API error:", result);
            res.status(500).json({ error: "Failed to generate affirmation from API." });
        }

    } catch (error) {
        console.error('Error calling Hugging Face API:', error);
        res.status(500).json({ error: "Server error during affirmation generation." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
