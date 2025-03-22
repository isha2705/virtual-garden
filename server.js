import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Google Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Route to serve the advanced search page
app.get('/advanced-search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'advanced-search.html'));
});

// Default route to redirect to advanced search
app.get("/", (req, res) => {
    res.redirect('/advanced-search');
});

// API Endpoint to fetch herbs
app.post("/api/search", async (req, res) => {
    const { category, part, country, purpose } = req.body;

    if (!category || !part || !country || !purpose) {
        return res.status(400).json({ 
            success: false, 
            error: "All fields are required!" 
        });
    }

    const prompt = `As a knowledgeable herbalist, provide detailed information about medicinal herbs that meet the following criteria:
- Traditional System: ${category}
- Origin/Region: ${country}
- Plant Part Used: ${part}
- Therapeutic Purpose: ${purpose}

For each herb, please provide:
1. Common Name
2. Scientific Name (in italics)
3. Brief Description (2-3 sentences about appearance and characteristics)
4. Traditional Uses (specifically for ${purpose})
5. Preparation Method
6. Safety Considerations

Please format the response in a clear, organized manner with proper spacing between sections.
Limit the response to 3-4 most relevant herbs.`;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        if (!responseText || responseText.trim() === '') {
            throw new Error('Empty response from API');
        }

        res.json({ 
            success: true, 
            data: responseText 
        });
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch data from the AI model. Please try again." 
        });
    }
});

app.get("/api/models", async (req, res) => {
    try {
        const models = await genAI.listModels();
        res.json(models);
    } catch (error) {
        console.error("Error fetching models:", error);
        res.status(500).json({ error: "Failed to fetch models." });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        error: "Something broke on the server! Please try again later." 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});