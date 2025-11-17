const fs = require('fs');
const { VectorStore } = require('./build-embeddings');

// Test the vector store structure without requiring API calls
console.log('Testing RAG Structure (No API Key Required)\n');
console.log('='.repeat(60));

// Test 1: Vector Store Creation
console.log('\nTest 1: Vector Store Creation');
const vectorStore = new VectorStore();

// Create mock vectors (3-dimensional for testing)
const mockVector1 = [0.1, 0.2, 0.3];
const mockVector2 = [0.4, 0.5, 0.6];
const mockVector3 = [0.7, 0.8, 0.9];

vectorStore.add(mockVector1, {
  scheme: 'Nippon India Large Cap Fund Direct Growth',
  factType: 'expense_ratio',
  value: '0.67%',
  sourceUrl: 'https://example.com'
});

vectorStore.add(mockVector2, {
  scheme: 'Nippon India Flexi Cap Fund Direct Growth',
  factType: 'exit_load',
  value: '1% if redeemed within 12 months',
  sourceUrl: 'https://example.com'
});

vectorStore.add(mockVector3, {
  scheme: 'Nippon India ELSS Tax Saver Fund Direct Growth',
  factType: 'lock_in',
  value: '3 years',
  sourceUrl: 'https://example.com'
});

console.log('✓ Vector store created with 3 mock vectors');

// Test 2: Cosine Similarity
console.log('\nTest 2: Cosine Similarity Calculation');
const queryVector = [0.15, 0.25, 0.35]; // Similar to mockVector1
const results = vectorStore.search(queryVector, 2);

console.log(`✓ Found ${results.length} similar vectors:`);
results.forEach((result, index) => {
  console.log(`  ${index + 1}. Similarity: ${result.similarity.toFixed(4)}`);
  console.log(`     Scheme: ${result.metadata.scheme}`);
  console.log(`     Fact: ${result.metadata.factType} = ${result.metadata.value}`);
});

// Test 3: Knowledge Base Structure
console.log('\nTest 3: Knowledge Base Structure');
if (fs.existsSync('knowledge_base.json')) {
  const kb = JSON.parse(fs.readFileSync('knowledge_base.json', 'utf8'));
  const schemeCount = Object.keys(kb.schemes).length;
  console.log(`✓ Knowledge base loaded with ${schemeCount} schemes`);
  
  // Count total facts
  let factCount = 0;
  for (const scheme of Object.values(kb.schemes)) {
    factCount += Object.keys(scheme).length;
  }
  console.log(`✓ Total facts across all schemes: ${factCount}`);
} else {
  console.log('✗ knowledge_base.json not found');
}

// Test 4: Advice Detection
console.log('\nTest 4: Advice Detection');
// Copy advice detection function directly to avoid loading embeddings
const adviceKeywords = [
  'should i', 'should i invest', 'is it good', 'is it bad', 'recommend', 'recommendation',
  'best', 'worst', 'better', 'worse', 'compare', 'comparison', 'which is better',
  'should i buy', 'should i sell', 'advice', 'suggest', 'opinion', 'think',
  'returns', 'performance', 'how much will i get', 'profit', 'loss', 'gain'
];

function isAdviceQuestion(question) {
  const lowerQuestion = question.toLowerCase();
  return adviceKeywords.some(keyword => lowerQuestion.includes(keyword));
}

const testQuestions = [
  'What is the expense ratio?', // Should pass
  'Should I invest?', // Should be refused
  'Which fund is better?', // Should be refused
  'What is the minimum SIP?', // Should pass
];

testQuestions.forEach((q, i) => {
  const isAdvice = isAdviceQuestion(q);
  console.log(`  ${i + 1}. "${q}" -> ${isAdvice ? 'REFUSED (advice)' : 'ALLOWED (factual)'}`);
});

console.log('\n' + '='.repeat(60));
console.log('\nStructure Tests Complete!');
console.log('\nTo fully test the RAG system:');
console.log('1. Create .env file with: GOOGLE_API_KEY=your_key_here');
console.log('   Get your API key from: https://aistudio.google.com/app/apikey');
console.log('2. Run: npm run build-embeddings');
console.log('3. Run: npm test');

