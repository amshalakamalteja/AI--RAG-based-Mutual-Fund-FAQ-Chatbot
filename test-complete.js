const { getAnswer } = require('./faq-assistant-rag');

// Comprehensive test cases covering all functionality
const testCases = [
  // Expense Ratio Tests
  {
    question: 'What is the expense ratio of Nippon India Large Cap Fund?',
    expected: 'expense ratio',
    shouldRefuse: false
  },
  {
    question: 'Tell me the expense ratio for Flexi Cap direct plan',
    expected: 'expense ratio',
    shouldRefuse: false
  },
  
  // Exit Load Tests
  {
    question: 'What is the exit load for ELSS Tax Saver Fund?',
    expected: 'exit load',
    shouldRefuse: false
  },
  {
    question: 'Exit load for Balanced Advantage Fund?',
    expected: 'exit load',
    shouldRefuse: false
  },
  
  // Minimum SIP Tests
  {
    question: 'What is the minimum SIP for Large Cap Fund?',
    expected: 'minimum SIP',
    shouldRefuse: false
  },
  {
    question: 'Minimum SIP amount for ELSS?',
    expected: 'minimum SIP',
    shouldRefuse: false
  },
  
  // Minimum Lump Sum Tests
  {
    question: 'What is the minimum lump sum investment for Liquid Fund?',
    expected: 'minimum lump sum',
    shouldRefuse: false
  },
  {
    question: 'Minimum investment amount for Flexi Cap?',
    expected: 'minimum lump sum',
    shouldRefuse: false
  },
  
  // Lock-in Tests
  {
    question: 'What is the lock-in period for ELSS?',
    expected: 'lock-in',
    shouldRefuse: false
  },
  {
    question: 'Lock-in for ELSS Tax Saver Fund?',
    expected: 'lock-in',
    shouldRefuse: false
  },
  
  // Riskometer Tests
  {
    question: 'What is the riskometer for Large Cap Fund?',
    expected: 'riskometer',
    shouldRefuse: false
  },
  {
    question: 'Risk rating for Liquid Fund?',
    expected: 'riskometer',
    shouldRefuse: false
  },
  
  // Benchmark Tests
  {
    question: 'What benchmark does Balanced Advantage Fund use?',
    expected: 'benchmark',
    shouldRefuse: false
  },
  {
    question: 'Benchmark for Flexi Cap Fund?',
    expected: 'benchmark',
    shouldRefuse: false
  },
  
  // Statement Download Tests
  {
    question: 'How can I download capital gains statement from CAMS?',
    expected: 'statement download',
    shouldRefuse: false
  },
  {
    question: 'How to download statements from Groww?',
    expected: 'statement download',
    shouldRefuse: false
  },
  {
    question: 'How do I download my account statement?',
    expected: 'statement download',
    shouldRefuse: false
  },
  
  // Advice Refusal Tests
  {
    question: 'Should I invest in Large Cap Fund?',
    expected: 'refused',
    shouldRefuse: true
  },
  {
    question: 'Which fund is better?',
    expected: 'refused',
    shouldRefuse: true
  },
  {
    question: 'What are the returns?',
    expected: 'refused',
    shouldRefuse: true
  },
  {
    question: 'Can you recommend a fund?',
    expected: 'refused',
    shouldRefuse: true
  },
  {
    question: 'Is Large Cap Fund good?',
    expected: 'refused',
    shouldRefuse: true
  },
];

async function runCompleteTests() {
  console.log('='.repeat(70));
  console.log('COMPREHENSIVE BACKEND TEST');
  console.log('='.repeat(70));
  console.log(`\nRunning ${testCases.length} test cases...\n`);
  
  let passed = 0;
  let failed = 0;
  const failures = [];
  
  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    try {
      const result = await getAnswer(test.question);
      const isRefused = result.answer.includes("cannot provide investment advice");
      const hasSourceUrl = result.source_url !== null;
      
      // Check if refusal matches expectation
      if (test.shouldRefuse && !isRefused) {
        failed++;
        failures.push({
          test: i + 1,
          question: test.question,
          issue: 'Should be refused but was answered',
          result: result.answer.substring(0, 100)
        });
        console.log(`✗ Test ${i + 1}: FAILED - Should refuse but answered`);
      } else if (!test.shouldRefuse && isRefused) {
        failed++;
        failures.push({
          test: i + 1,
          question: test.question,
          issue: 'Should be answered but was refused',
          result: result.answer
        });
        console.log(`✗ Test ${i + 1}: FAILED - Should answer but refused`);
      } else if (!test.shouldRefuse && !hasSourceUrl) {
        failed++;
        failures.push({
          test: i + 1,
          question: test.question,
          issue: 'Answer provided but missing source URL',
          result: result.answer.substring(0, 100)
        });
        console.log(`✗ Test ${i + 1}: FAILED - Missing source URL`);
      } else {
        passed++;
        console.log(`✓ Test ${i + 1}: PASSED`);
      }
    } catch (error) {
      failed++;
      failures.push({
        test: i + 1,
        question: test.question,
        issue: 'Error: ' + error.message
      });
      console.log(`✗ Test ${i + 1}: ERROR - ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('TEST RESULTS');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${testCases.length}`);
  console.log(`Passed: ${passed} ✓`);
  console.log(`Failed: ${failed} ✗`);
  console.log(`Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);
  
  if (failures.length > 0) {
    console.log('\n' + '='.repeat(70));
    console.log('FAILURES:');
    console.log('='.repeat(70));
    failures.forEach(f => {
      console.log(`\nTest ${f.test}: ${f.question}`);
      console.log(`Issue: ${f.issue}`);
      if (f.result) {
        console.log(`Result: ${f.result}`);
      }
    });
  }
  
  console.log('\n' + '='.repeat(70));
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
if (require.main === module) {
  if (!process.env.GOOGLE_API_KEY) {
    console.error('Error: GOOGLE_API_KEY not found in environment variables.');
    console.error('Please create a .env file with: GOOGLE_API_KEY=your_api_key_here');
    process.exit(1);
  }
  runCompleteTests().catch(console.error);
}

