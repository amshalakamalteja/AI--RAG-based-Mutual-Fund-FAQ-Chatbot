const { getAnswer } = require('./faq-assistant-rag');

// Test cases
const testQuestions = [
  'What is the expense ratio of Nippon India Large Cap Fund?',
  'Tell me about the exit load for Flexi Cap Fund',
  'What is the minimum SIP amount for ELSS?',
  'What is the lock-in period for ELSS Tax Saver Fund?',
  'What is the riskometer rating for Liquid Fund?',
  'What benchmark does Balanced Advantage Fund use?',
  'How can I download capital gains statement from CAMS?',
  'Should I invest in Large Cap Fund?', // Should be refused
  'Which fund is better?', // Should be refused
  'What are the returns?', // Should be refused
  'What is the minimum investment amount for Large Cap?',
  'Tell me about expense ratio for direct plan of Flexi Cap',
];

async function runTests() {
  console.log('Testing RAG-based FAQ Assistant\n');
  console.log('='.repeat(60));

  for (let i = 0; i < testQuestions.length; i++) {
    const question = testQuestions[i];
    console.log(`\nTest ${i + 1}: ${question}`);
    try {
      const result = await getAnswer(question);
      console.log(`Answer: ${result.answer}`);
      if (result.source_url) {
        console.log(`Source: ${result.source_url}`);
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
    console.log('-'.repeat(60));
  }

  console.log('\nAll tests completed!');
  process.exit(0);
}

// Run tests
if (require.main === module) {
  if (!process.env.GOOGLE_API_KEY) {
    console.error('Error: GOOGLE_API_KEY not found in environment variables.');
    console.error('Please create a .env file with: GOOGLE_API_KEY=your_api_key_here');
    console.error('Get your API key from: https://aistudio.google.com/app/apikey');
    process.exit(1);
  }
  runTests().catch(console.error);
}

