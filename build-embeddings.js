const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const knowledgeBase = JSON.parse(fs.readFileSync('knowledge_base.json', 'utf8'));

// Initialize Google Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Simple in-memory vector store
class VectorStore {
  constructor() {
    this.vectors = [];
    this.metadata = [];
  }

  add(vector, metadata) {
    this.vectors.push(vector);
    this.metadata.push(metadata);
  }

  // Cosine similarity search
  search(queryVector, topK = 3) {
    const similarities = this.vectors.map((vector, index) => {
      const similarity = this.cosineSimilarity(queryVector, vector);
      return { index, similarity, metadata: this.metadata[index] };
    });

    // Sort by similarity (descending) and return top K
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  save(filepath) {
    const data = {
      vectors: this.vectors,
      metadata: this.metadata
    };
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`Vector store saved to ${filepath}`);
  }

  load(filepath) {
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    this.vectors = data.vectors;
    this.metadata = data.metadata;
    console.log(`Vector store loaded from ${filepath} (${this.vectors.length} vectors)`);
  }
}

// Generate embedding using Google Gemini embedding model
async function getEmbedding(text) {
  try {
    // Use text-embedding-004 model for embeddings
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    // The embedding is in result.embedding.values array
    const embedding = result.embedding;
    return embedding.values || embedding;
  } catch (error) {
    console.error('Error generating embedding:', error.message);
    throw error;
  }
}

// Convert knowledge base to chunks with embeddings
async function buildEmbeddings() {
  console.log('Building embeddings from knowledge base...\n');
  
  const vectorStore = new VectorStore();
  let chunkCount = 0;

  // Process each scheme
  for (const [schemeName, schemeData] of Object.entries(knowledgeBase.schemes)) {
    console.log(`Processing: ${schemeName}`);
    
    // Create chunks for each fact type
    for (const [factType, factData] of Object.entries(schemeData)) {
      if (factType === 'expense_ratio') {
        // Create separate chunks for direct and regular
        const directText = `${schemeName} expense ratio direct plan is ${factData.direct}`;
        const directEmbedding = await getEmbedding(directText);
        vectorStore.add(directEmbedding, {
          scheme: schemeName,
          factType: 'expense_ratio',
          factSubType: 'direct',
          value: factData.direct,
          sourceUrl: factData.source_url,
          text: directText
        });
        chunkCount++;

        const regularText = `${schemeName} expense ratio regular plan is ${factData.regular}`;
        const regularEmbedding = await getEmbedding(regularText);
        vectorStore.add(regularEmbedding, {
          scheme: schemeName,
          factType: 'expense_ratio',
          factSubType: 'regular',
          value: factData.regular,
          sourceUrl: factData.source_url,
          text: regularText
        });
        chunkCount++;
      } else {
        // Create chunk for other fact types
        const text = `${schemeName} ${factType.replace(/_/g, ' ')} is ${factData.value}`;
        const embedding = await getEmbedding(text);
        vectorStore.add(embedding, {
          scheme: schemeName,
          factType: factType,
          value: factData.value,
          sourceUrl: factData.source_url,
          text: text
        });
        chunkCount++;
      }
    }
  }

  // Process statement download info
  for (const [platform, info] of Object.entries(knowledgeBase.statement_download)) {
    const text = `How to download statements from ${platform}: ${info.description}`;
    const embedding = await getEmbedding(text);
    vectorStore.add(embedding, {
      scheme: null,
      factType: 'statement_download',
      platform: platform,
      description: info.description,
      sourceUrl: info.source_url,
      text: text
    });
    chunkCount++;
  }

  // Save vector store
  vectorStore.save('embeddings.json');
  console.log(`\n✓ Generated ${chunkCount} embeddings`);
  console.log('✓ Vector store saved to embeddings.json');
}

// Run if executed directly
if (require.main === module) {
  if (!process.env.GOOGLE_API_KEY) {
    console.error('Error: GOOGLE_API_KEY not found in environment variables.');
    console.error('Please create a .env file with: GOOGLE_API_KEY=your_api_key_here');
    console.error('Get your API key from: https://aistudio.google.com/app/apikey');
    process.exit(1);
  }
  buildEmbeddings().catch(console.error);
}

module.exports = { VectorStore, getEmbedding };

