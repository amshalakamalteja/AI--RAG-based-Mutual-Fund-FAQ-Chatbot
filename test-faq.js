const { getAnswer } = require('./faq-assistant');

// Test cases
const testQuestions = [
  'What is the expense ratio of Nippon India Large Cap Fund?',
  'What is the exit load for Flexi Cap Fund?',
  'What is the minimum SIP for ELSS?',
  'What is the lock-in period for ELSS Tax Saver Fund?',
  'What is the riskometer for Liquid Fund?',
  'What is the benchmark for Balanced Advantage Fund?',
  'How to download capital gains statement from CAMS?',
  'Should I invest in Large Cap Fund?', // Should be refused
  'Which fund is better?', // Should be refused
  'What are the returns?', // Should be refused
];

console.log('Testing FAQ Assistant\n');
console.log('='.repeat(60));

testQuestions.forEach((question, index) => {
  console.log(`\nTest ${index + 1}: ${question}`);
  const result = getAnswer(question);
  console.log(`Answer: ${result.answer}`);
  if (result.source_url) {
    console.log(`Source: ${result.source_url}`);
  }
  console.log('-'.repeat(60));
});

console.log('\nAll tests completed!');

