const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

// Google Vertex AI setup
const { VertexAI } = require("@google-cloud/vertexai");
const vertexAI = new VertexAI({
  project: process.env.PROJECT_ID,
  location: process.env.LOCATION,
});

// Gemini model setup
const model = vertexAI.preview.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  generation_config: {
    max_output_tokens: 1000,
    temperature: 0.7,
  },
});

// MongoDB Room model
const Room = require("../models/room"); // ✅ adjust this path if needed

// Route: POST /api/chat
router.post("/chat", auth, async (req, res) => {
  try {
    const userQuery = req.body.message;

    // 1. Get room data dynamically from MongoDB
    const rooms = await Room.find({ isAvailable: true });

    // 2. Create grounding prompt
    const prompt = `
You are a smart hotel assistant bot for a hotel Vyankatesh in Pune . 
Use the following hotel data to help
answer user queries and answer them in politeness and humbly .
Be polite, concise, and helpful.

Hotel Data: ${JSON.stringify(rooms)}

When a user asks for a room type, availability,amenities, or guest capacity,
find the matching room and respond with:

- Type
- Capacity
- Price
- Availability
- **Markdown clickable link** like this: [View Room](http://localhost:5173/specific/<roomId>)
If no room is found, say "No matching room available."

Only respond existing room type , if user asks about room in hotel

if user ask for room which is not exist in hotel then reply him politely 


      User Question: ${userQuery}
    `;

    // 3. Start Gemini chat and send prompt
    const chat = model.startChat();
    const result = await chat.sendMessage(prompt);
    const reply = result.response.candidates[0].content.parts[0].text;

    // 4. Send reply to frontend
    res.json({ reply });
  } catch (err) {
    console.error("Gemini Error:", err.message);
    res.status(500).json({ error: "Something went wrong while chatting." });
  }
});

module.exports = router;

