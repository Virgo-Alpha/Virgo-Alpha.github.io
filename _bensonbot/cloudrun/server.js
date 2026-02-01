const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Serve static files from the 'public' directory
// Note: You should build your Jekyll site and copy _site/ contents to 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Chat API endpoint
app.post('/chat', async (req, res) => {
  try {
    const { query, context } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are Bensonbot, an AI assistant for Benson Mugure's portfolio.
    Your goal is to help recruiters and visitors learn about Benson's skills, experience, and projects.
    
    Use the following context to answer the user's question.
    If the answer is not in the context, say "I don't have that information in my knowledge base, but I can tell you about Benson's web development skills or projects."
    
    Context:
    ${context}
    
    User Question: ${query}
    
    Answer as if you are Benson's helpful assistant. Be professional, concise, and enthusiastic.`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// Fallback for SPA or just to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Bensonbot server listening on port ${port}`);
});
