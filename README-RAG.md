# RAG-based FAQ Assistant for Nippon India Mutual Funds

This is the RAG (Retrieval-Augmented Generation) version of the FAQ assistant that uses semantic search over the knowledge base to answer questions about Nippon India Mutual Fund schemes.

## Features

- **Semantic Search**: Uses embeddings to understand questions naturally, not just keyword matching
- **Facts-Only**: Provides only factual information, no investment advice
- **Source URLs**: Every answer includes one official source URL
- **Advice Refusal**: Automatically refuses advice-seeking questions

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Gemini API Key

Create a `.env` file in the root directory:

```
GOOGLE_API_KEY=your_google_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikey

### 3. Build Embeddings

Generate embeddings from the knowledge base:

```bash
npm run build-embeddings
```

This will create `embeddings.json` containing the vector store.

## Usage

### Run the FAQ Assistant

```bash
npm start
```

Or directly:

```bash
node faq-assistant-rag.js
```

### Run Tests

```bash
npm test
```

Or directly:

```bash
node test-rag.js
```

## How It Works

1. **Knowledge Base**: Structured facts stored in `knowledge_base.json`
2. **Embeddings**: Each fact is converted to an embedding vector using Google's text-embedding-004 model
3. **Vector Store**: Embeddings stored in `embeddings.json` with metadata (scheme name, fact type, source URL)
4. **Query Processing**: User question is converted to an embedding
5. **Semantic Search**: Cosine similarity search finds most relevant facts
6. **Answer Generation**: Template-based answer generation from retrieved context

## Files

- `faq-assistant-rag.js` - Main RAG-based FAQ assistant
- `build-embeddings.js` - Script to generate embeddings from knowledge base
- `knowledge_base.json` - Structured knowledge base with facts and source URLs
- `embeddings.json` - Generated vector store (created after running build-embeddings)
- `test-rag.js` - Test script

## Differences from Rule-Based Version

- **Natural Language Understanding**: Can understand questions phrased in different ways
- **Semantic Matching**: Finds relevant information even if exact keywords don't match
- **Better Context**: Uses similarity scores to determine relevance

## Requirements

- Node.js
- Google Gemini API key (for generating embeddings)
- npm packages: `@google/generative-ai`, `dotenv`

