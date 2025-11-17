const fs = require('fs');
const readline = require('readline');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const { VectorStore, getEmbedding } = require('./build-embeddings');

// Load knowledge base
const knowledgeBase = JSON.parse(fs.readFileSync('knowledge_base.json', 'utf8'));

// Load vector store
const vectorStore = new VectorStore();
if (fs.existsSync('embeddings.json')) {
  vectorStore.load('embeddings.json');
} else {
  console.error('Error: embeddings.json not found. Please run: npm run build-embeddings');
  process.exit(1);
}

// Initialize Google Gemini AI client for embeddings
const genAI = process.env.GOOGLE_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY) : null;

// Advice keywords that should trigger refusal (using word boundaries for precision)
const advicePatterns = [
  /\bshould i\b.*\binvest\b/i,
  /\bshould i\b.*\bbuy\b/i,
  /\bshould i\b.*\bsell\b/i,
  /\bis.*\bgood\b/i,
  /\bis.*\bbad\b/i,
  /\bis.*\bworth\b/i,
  /\brecommend\b/i,
  /\brecommendation\b/i,
  /\bwhich.*\bbetter\b/i,
  /\bwhich.*\bbest\b/i,
  /\bwhich.*\bworst\b/i,
  /\bcompare\b/i,
  /\bcomparison\b/i,
  /\badvice\b/i,
  /\bsuggest\b/i,
  /\bopinion\b/i,
  /\bwhat.*\breturns\b/i,
  /\bwhat.*\bperformance\b/i,
  /\bhow much will i get\b/i,
  /\bprofit\b.*\bloss\b/i,
  /\binvestment advice\b/i
];

// Check if question is advice-seeking
function isAdviceQuestion(question) {
  const lowerQuestion = question.toLowerCase();
  
  // Allow statement download questions
  if (lowerQuestion.includes('download') || lowerQuestion.includes('statement') || 
      lowerQuestion.includes('capital gain') || lowerQuestion.includes('account statement') ||
      lowerQuestion.includes('tax statement')) {
    return false;
  }
  
  // Check against advice patterns
  return advicePatterns.some(pattern => pattern.test(question));
}

// Generate answer from retrieved context
function generateAnswer(question, topResults) {
  if (topResults.length === 0) {
    return {
      answer: "I couldn't find relevant information to answer your question. Please try rephrasing or ask about expense ratio, exit load, minimum SIP, minimum lump sum, lock-in, riskometer, benchmark, or statement downloads.",
      source_url: null
    };
  }

  // Use the top result (highest similarity)
  const topResult = topResults[0];
  const metadata = topResult.metadata;

  // If similarity is too low, indicate uncertainty
  if (topResult.similarity < 0.5) {
    return {
      answer: "I found some related information, but it may not directly answer your question. Please try rephrasing or be more specific about which scheme and fact you're asking about.",
      source_url: metadata.sourceUrl || null
    };
  }

  // Generate answer based on fact type
  let answerText = '';

  if (metadata.factType === 'expense_ratio') {
    if (metadata.factSubType === 'direct') {
      answerText = `The expense ratio for ${metadata.scheme} Direct plan is ${metadata.value}.`;
    } else {
      answerText = `The expense ratio for ${metadata.scheme} Regular plan is ${metadata.value}.`;
    }
    // If question asks about expense ratio in general, provide both
    const lowerQuestion = question.toLowerCase();
    if (!lowerQuestion.includes('direct') && !lowerQuestion.includes('regular')) {
      // Find both direct and regular from knowledge base
      const scheme = knowledgeBase.schemes[metadata.scheme];
      if (scheme && scheme.expense_ratio) {
        answerText = `The expense ratio for ${metadata.scheme} is ${scheme.expense_ratio.direct} for Direct plan and ${scheme.expense_ratio.regular} for Regular plan.`;
      }
    }
  } else if (metadata.factType === 'statement_download') {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('cams')) {
      // Find CAMS info from knowledge base
      if (knowledgeBase.statement_download.cams) {
        answerText = `To download capital gains/account/tax statements from CAMS, visit: ${knowledgeBase.statement_download.cams.source_url}`;
      } else {
        answerText = `To download statements from ${metadata.platform}, visit: ${metadata.sourceUrl}`;
      }
    } else if (lowerQuestion.includes('groww')) {
      // Find Groww info from knowledge base
      if (knowledgeBase.statement_download.groww) {
        answerText = `To download reports and statements on Groww, visit: ${knowledgeBase.statement_download.groww.source_url}`;
      } else {
        answerText = `To download statements from ${metadata.platform}, visit: ${metadata.sourceUrl}`;
      }
    } else {
      // General statement download answer
      answerText = `To download statements from ${metadata.platform}, visit: ${metadata.sourceUrl}`;
    }
  } else {
    // For other fact types, use the value directly
    answerText = `${metadata.scheme}: ${metadata.value}`;
  }

  return {
    answer: answerText,
    source_url: metadata.sourceUrl || null
  };
}

// Get answer using RAG
async function getAnswer(question) {
  // Check for advice-seeking questions first
  if (isAdviceQuestion(question)) {
    return {
      answer: "I'm sorry, but I cannot provide investment advice, recommendations, comparisons, or opinions. I can only provide factual information about the schemes.",
      source_url: null
    };
  }

  // Generate embedding for the question
  let questionEmbedding;
  try {
    if (!genAI) {
      throw new Error('Google API key not configured');
    }
    questionEmbedding = await getEmbedding(question);
  } catch (error) {
    console.error('Error generating embedding:', error.message);
    return {
      answer: "I'm having trouble processing your question. Please ensure GOOGLE_API_KEY is set in your .env file.",
      source_url: null
    };
  }

  // Search for similar chunks
  const topResults = vectorStore.search(questionEmbedding, 3);

  // Generate answer from retrieved context
  return generateAnswer(question, topResults);
}

// Main CLI interface
function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Nippon India Mutual Fund FAQ Assistant (RAG Version)');
  console.log('===================================================');
  console.log('I can answer factual questions about:');
  console.log('- Expense ratio');
  console.log('- Exit load');
  console.log('- Minimum SIP');
  console.log('- Minimum lump sum');
  console.log('- Lock-in (for ELSS)');
  console.log('- Riskometer');
  console.log('- Benchmark');
  console.log('- How to download statements');
  console.log('\nI cannot provide investment advice, recommendations, or comparisons.');
  console.log('Type "exit" to quit.\n');

  function askQuestion() {
    rl.question('Your question: ', async (question) => {
      if (question.toLowerCase().trim() === 'exit') {
        console.log('Goodbye!');
        rl.close();
        return;
      }

      if (!question.trim()) {
        askQuestion();
        return;
      }

      try {
        const result = await getAnswer(question);
        console.log('\nAnswer:', result.answer);
        if (result.source_url) {
          console.log('Source:', result.source_url);
        }
        console.log('');
      } catch (error) {
        console.error('\nError:', error.message);
        console.log('');
      }
      
      askQuestion();
    });
  }

  askQuestion();
}

// Run if executed directly
if (require.main === module) {
  if (!process.env.GOOGLE_API_KEY) {
    console.error('Error: GOOGLE_API_KEY not found in environment variables.');
    console.error('Please create a .env file with: GOOGLE_API_KEY=your_api_key_here');
    console.error('Get your API key from: https://aistudio.google.com/app/apikey');
    process.exit(1);
  }
  main();
}

module.exports = { getAnswer, isAdviceQuestion };

