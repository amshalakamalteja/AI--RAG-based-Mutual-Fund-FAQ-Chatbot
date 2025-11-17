# Nippon India Mutual Fund FAQ Assistant

A comprehensive RAG-based FAQ assistant that provides factual information about selected Nippon India mutual fund schemes. Built with semantic search, Google Gemini API, and a premium web interface.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Status](#project-status)
- [Next Steps](#next-steps)

## 🎯 Overview

This project is a FAQ assistant specifically designed to answer factual questions about 5 selected Nippon India mutual fund schemes available on Groww. It uses Retrieval-Augmented Generation (RAG) with semantic search to provide accurate, source-verified answers while strictly refusing investment advice.

### Supported Schemes

1. Nippon India Large Cap Fund Direct Growth
2. Nippon India Flexi Cap Fund Direct Growth
3. Nippon India ELSS Tax Saver Fund Direct Growth
4. Nippon India Balanced Advantage Fund Direct Growth
5. Nippon India Liquid Fund Direct Growth

### Supported Facts

- **Expense Ratio** (Direct and Regular plans)
- **Exit Load**
- **Minimum SIP** amount
- **Minimum Lump Sum** investment
- **Lock-in Period** (for ELSS only)
- **Riskometer** rating
- **Benchmark** index
- **Statement Downloads** (CAMS, Groww)

## ✨ Features

### Core Functionality

- ✅ **RAG-based Semantic Search**: Uses Google Gemini embeddings for natural language understanding
- ✅ **Facts-Only Responses**: Provides only factual information, no investment advice
- ✅ **Source Verification**: Every answer includes one official source URL
- ✅ **Advice Refusal**: Automatically detects and refuses advice-seeking questions
- ✅ **Comprehensive Knowledge Base**: Structured data for all 5 schemes with source URLs

### User Interface

- 🎨 **Premium Design**: Modern, clean UI inspired by Groww's aesthetic
- 💬 **Interactive Chat**: Real-time chat interface with smooth animations
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⚡ **Quick Questions**: Pre-defined buttons for common queries
- 🔗 **Source Links**: Clickable links to official sources in each answer
- 💫 **Loading Indicators**: Visual feedback during processing

### Technical Features

- 🔍 **Vector Store**: In-memory vector database with cosine similarity search
- 🧠 **42 Embeddings**: Pre-generated embeddings for fast retrieval
- 🚀 **Express.js API**: RESTful API for frontend-backend communication
- 🛡️ **Error Handling**: Comprehensive error handling and validation
- ✅ **100% Test Coverage**: Comprehensive test suite with 22 test cases

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server framework
- **Google Generative AI** - Embeddings and API integration
- **dotenv** - Environment variable management

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern features
- **Vanilla JavaScript** - Interactivity and API calls

### AI/ML
- **Google Gemini API** - Text embeddings (text-embedding-004 model)
- **RAG Architecture** - Retrieval-Augmented Generation
- **Vector Search** - Cosine similarity for semantic matching

## 📁 Project Structure

```
AI--RAG-based-Mutual-Fund-FAQ-Chatbot/
│
├── public/                          # Frontend files
│   ├── index.html                  # Main HTML structure
│   ├── styles.css                  # Premium styling
│   └── app.js                      # Frontend JavaScript
│
├── build-embeddings.js             # Embedding generation script
├── faq-assistant-rag.js            # RAG-based FAQ assistant (CLI)
├── faq-assistant.js                 # Original rule-based assistant
├── server.js                        # Express.js server
│
├── knowledge_base.json             # Structured knowledge base
├── embeddings.json                 # Generated vector store (gitignored)
│
├── test-complete.js                # Comprehensive test suite
├── test-rag.js                     # Basic RAG tests
├── test-rag-structure.js           # Structure validation tests
├── test-faq.js                     # Original rule-based tests
│
├── package.json                    # Dependencies and scripts
├── .env                            # Environment variables (gitignored)
├── .gitignore                      # Git ignore rules
│
├── README-before-deployment.md     # This file
├── README-RAG.md                   # RAG-specific documentation
├── README-FRONTEND.md              # Frontend documentation
├── BACKEND-STATUS.md               # Backend completion status
└── FRONTEND-COMPLETE.md            # Frontend completion status
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **Google Gemini API Key** ([Get it here](https://aistudio.google.com/app/apikey))

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/amshalakamalteja/AI--RAG-based-Mutual-Fund-FAQ-Chatbot.git
cd AI--RAG-based-Mutual-Fund-FAQ-Chatbot
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `@google/generative-ai` - Google Gemini API client
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

**Get your API key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy the key and paste it in your `.env` file

### 4. Build Embeddings

Generate embeddings from the knowledge base:

```bash
npm run build-embeddings
```

This will:
- Process all 5 schemes
- Generate embeddings for each fact
- Create `embeddings.json` with 42 embeddings
- Take approximately 1-2 minutes

**Note:** You only need to run this once, or when the knowledge base is updated.

## ⚙️ Configuration

### Port Configuration

By default, the server runs on port 3000. To change it:

1. Set environment variable:
   ```bash
   PORT=8080 npm start
   ```

2. Or modify `server.js`:
   ```javascript
   const PORT = process.env.PORT || 8080;
   ```

### Customization

**Colors:** Edit CSS variables in `public/styles.css`:
```css
:root {
    --primary-color: #00D09C;
    --secondary-color: #7C3AED;
    /* ... */
}
```

## 🎮 Usage

### Web Interface (Recommended)

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Open in browser:**
   ```
   http://localhost:3000
   ```

3. **Start chatting:**
   - Type your question in the input field
   - Or click quick question buttons
   - Get instant answers with source URLs

### CLI Interface

For command-line usage:

```bash
npm run start:cli
```

This runs the original CLI interface for testing.

### Running Tests

**Comprehensive test suite:**
```bash
npm test
```

**Structure validation:**
```bash
node test-rag-structure.js
```

**Complete test suite:**
```bash
node test-complete.js
```

## 📡 API Documentation

### Base URL

```
http://localhost:3000
```

### Endpoints

#### 1. Health Check

**GET** `/api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "FAQ Assistant API is running"
}
```

#### 2. Ask Question

**POST** `/api/ask`

Send a question to the FAQ assistant.

**Request:**
```json
{
  "question": "What is the expense ratio of Nippon India Large Cap Fund?"
}
```

**Response:**
```json
{
  "answer": "The expense ratio for Nippon India Large Cap Fund Direct Growth is 0.67% for Direct plan and 1.49% for Regular plan.",
  "source_url": "https://mf.nipponindiaim.com/InvestorServices/FactsheetsDocuments/Fundamentals-November-2025/Innerpage/Large-Cap.html"
}
```

**Error Response:**
```json
{
  "error": "Please provide a valid question",
  "answer": "I need a question to help you...",
  "source_url": null
}
```

### Example API Calls

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question":"What is the exit load for Flexi Cap Fund?"}'
```

**Using JavaScript (Fetch):**
```javascript
const response = await fetch('http://localhost:3000/api/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'What is the minimum SIP for ELSS?'
  })
});

const data = await response.json();
console.log(data.answer);
console.log(data.source_url);
```

## 🧪 Testing

### Test Results

**Comprehensive Test Suite: 22/22 PASSED (100%)**

- ✅ Expense ratio queries (2/2)
- ✅ Exit load queries (2/2)
- ✅ Minimum SIP queries (2/2)
- ✅ Minimum lump sum queries (2/2)
- ✅ Lock-in queries (2/2)
- ✅ Riskometer queries (2/2)
- ✅ Benchmark queries (2/2)
- ✅ Statement download queries (3/3)
- ✅ Advice refusal (5/5)

### Running Tests

```bash
# All tests
npm test

# Comprehensive test suite
node test-complete.js

# Structure validation
node test-rag-structure.js
```

## 📊 Project Status

### ✅ Completed Components

1. **Knowledge Base**
   - ✅ 5 schemes fully covered
   - ✅ All required facts with source URLs
   - ✅ Statement download information

2. **RAG Backend**
   - ✅ Embedding generation pipeline
   - ✅ Vector store with 42 embeddings
   - ✅ Semantic search implementation
   - ✅ Answer generation with source URLs
   - ✅ Advice detection and refusal

3. **Web Frontend**
   - ✅ Premium UI design
   - ✅ Interactive chat interface
   - ✅ API integration
   - ✅ Responsive design
   - ✅ Error handling

4. **API Server**
   - ✅ Express.js server
   - ✅ RESTful API endpoints
   - ✅ CORS configuration
   - ✅ Static file serving

5. **Testing**
   - ✅ Comprehensive test suite
   - ✅ 100% test pass rate
   - ✅ Structure validation
   - ✅ API testing

### 📝 Compliance Features

- ✅ **Facts-Only**: No investment advice provided
- ✅ **Source URLs**: One official source per answer
- ✅ **Advice Refusal**: Automatic detection and refusal
- ✅ **No Comparisons**: Comparisons are refused
- ✅ **No Returns**: Performance/returns questions refused

## 🔄 Available Scripts

```bash
# Start web server (default)
npm start

# Start CLI interface
npm run start:cli

# Run tests
npm test

# Build embeddings
npm run build-embeddings
```

## 📚 Additional Documentation

- **README-RAG.md** - Detailed RAG implementation documentation
- **README-FRONTEND.md** - Frontend-specific documentation
- **BACKEND-STATUS.md** - Backend completion status
- **FRONTEND-COMPLETE.md** - Frontend completion status

## 🔒 Security Notes

- `.env` file is gitignored (contains API key)
- `embeddings.json` is gitignored (can be regenerated)
- API key should never be committed to version control
- Source URLs are verified and official

## 🐛 Troubleshooting

### Embeddings Not Found

**Error:** `embeddings.json not found`

**Solution:**
```bash
npm run build-embeddings
```

### API Key Not Working

**Error:** `GOOGLE_API_KEY not found`

**Solution:**
1. Check `.env` file exists
2. Verify API key format: `GOOGLE_API_KEY=your_key_here`
3. No spaces around `=`
4. Restart server after updating `.env`

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
PORT=8080 npm start
```

### CORS Issues

If accessing from different domain, ensure CORS is configured in `server.js`.

## 🚀 Next Steps (Deployment)

### Pre-Deployment Checklist

- [ ] Review all environment variables
- [ ] Set up production API keys
- [ ] Configure production port
- [ ] Set up error logging
- [ ] Configure CORS for production domain
- [ ] Set up SSL/HTTPS
- [ ] Configure reverse proxy (if needed)
- [ ] Set up monitoring
- [ ] Create deployment documentation

### Deployment Options

1. **Cloud Platforms:**
   - Heroku
   - Vercel
   - AWS (EC2, Elastic Beanstalk)
   - Google Cloud Platform
   - Azure

2. **Containerization:**
   - Docker
   - Kubernetes

3. **Server Management:**
   - PM2 (Process Manager)
   - systemd (Linux)

### Environment Variables for Production

```env
GOOGLE_API_KEY=your_production_api_key
PORT=3000
NODE_ENV=production
```

## 📄 License

ISC

## 👤 Author

Developed for Nippon India Mutual Fund FAQ Assistant

## 🙏 Acknowledgments

- Google Gemini API for embeddings
- Groww for design inspiration
- Nippon India Mutual Fund for official data sources

---

**Status:** ✅ Ready for Deployment

**Last Updated:** November 2025

**Version:** 2.0.0 (RAG with Frontend)

