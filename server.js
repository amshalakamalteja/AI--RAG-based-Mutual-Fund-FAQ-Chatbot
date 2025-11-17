const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import RAG assistant
const { getAnswer } = require('./faq-assistant-rag');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'FAQ Assistant API is running' });
});

// API endpoint for questions
app.post('/api/ask', async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question || typeof question !== 'string' || !question.trim()) {
            return res.status(400).json({
                error: 'Please provide a valid question',
                answer: 'I need a question to help you. Please ask about expense ratio, exit load, minimum SIP, lock-in, riskometer, benchmark, or statement downloads.',
                source_url: null
            });
        }
        
        // Get answer from RAG assistant
        const result = await getAnswer(question.trim());
        
        res.json({
            answer: result.answer,
            source_url: result.source_url
        });
        
    } catch (error) {
        console.error('Error processing question:', error);
        res.status(500).json({
            error: 'Internal server error',
            answer: 'Sorry, I encountered an error processing your question. Please try again.',
            source_url: null
        });
    }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 Nippon India Mutual Fund FAQ Assistant');
    console.log('='.repeat(60));
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔌 API: http://localhost:${PORT}/api/ask`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health`);
    console.log('='.repeat(60));
    console.log('✅ Server is running!\n');
});

module.exports = app;

