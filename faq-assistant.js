const fs = require('fs');
const readline = require('readline');

// Load knowledge base
const knowledgeBase = JSON.parse(fs.readFileSync('knowledge_base.json', 'utf8'));

// Scheme name mappings for flexible matching
const schemeMappings = {
  'large cap': 'Nippon India Large Cap Fund Direct Growth',
  'large-cap': 'Nippon India Large Cap Fund Direct Growth',
  'largecap': 'Nippon India Large Cap Fund Direct Growth',
  'flexi cap': 'Nippon India Flexi Cap Fund Direct Growth',
  'flexi-cap': 'Nippon India Flexi Cap Fund Direct Growth',
  'flexicap': 'Nippon India Flexi Cap Fund Direct Growth',
  'elss': 'Nippon India ELSS Tax Saver Fund Direct Growth',
  'tax saver': 'Nippon India ELSS Tax Saver Fund Direct Growth',
  'tax-saver': 'Nippon India ELSS Tax Saver Fund Direct Growth',
  'balanced advantage': 'Nippon India Balanced Advantage Fund Direct Growth',
  'balanced-advantage': 'Nippon India Balanced Advantage Fund Direct Growth',
  'liquid': 'Nippon India Liquid Fund Direct Growth',
  'liquid fund': 'Nippon India Liquid Fund Direct Growth'
};

// Advice keywords that should trigger refusal
const adviceKeywords = [
  'should i', 'should i invest', 'is it good', 'is it bad', 'recommend', 'recommendation',
  'best', 'worst', 'better', 'worse', 'compare', 'comparison', 'which is better',
  'should i buy', 'should i sell', 'advice', 'suggest', 'opinion', 'think',
  'returns', 'performance', 'how much will i get', 'profit', 'loss', 'gain'
];

// Check if question is advice-seeking
function isAdviceQuestion(question) {
  const lowerQuestion = question.toLowerCase();
  return adviceKeywords.some(keyword => lowerQuestion.includes(keyword));
}

// Extract scheme name from question
function extractSchemeName(question) {
  const lowerQuestion = question.toLowerCase();
  for (const [key, schemeName] of Object.entries(schemeMappings)) {
    if (lowerQuestion.includes(key)) {
      return schemeName;
    }
  }
  // Try exact match
  for (const schemeName of Object.keys(knowledgeBase.schemes)) {
    if (lowerQuestion.includes(schemeName.toLowerCase())) {
      return schemeName;
    }
  }
  return null;
}

// Extract fact type from question
function extractFactType(question) {
  const lowerQuestion = question.toLowerCase();
  if (lowerQuestion.includes('expense ratio') || lowerQuestion.includes('expense')) {
    return 'expense_ratio';
  }
  if (lowerQuestion.includes('exit load') || lowerQuestion.includes('exit load')) {
    return 'exit_load';
  }
  if (lowerQuestion.includes('minimum sip') || lowerQuestion.includes('sip minimum')) {
    return 'minimum_sip';
  }
  if (lowerQuestion.includes('minimum lump') || lowerQuestion.includes('lump sum') || 
      lowerQuestion.includes('minimum investment') || lowerQuestion.includes('minimum amount')) {
    return 'minimum_lump_sum';
  }
  if (lowerQuestion.includes('lock-in') || lowerQuestion.includes('lock in') || 
      lowerQuestion.includes('lockin') || lowerQuestion.includes('lock')) {
    return 'lock_in';
  }
  if (lowerQuestion.includes('riskometer') || lowerQuestion.includes('risk')) {
    return 'riskometer';
  }
  if (lowerQuestion.includes('benchmark')) {
    return 'benchmark';
  }
  if (lowerQuestion.includes('statement') || lowerQuestion.includes('download') || 
      lowerQuestion.includes('capital gain') || lowerQuestion.includes('account statement') ||
      lowerQuestion.includes('tax statement')) {
    return 'statement_download';
  }
  return null;
}

// Get answer for a question
function getAnswer(question) {
  // Check for advice-seeking questions
  if (isAdviceQuestion(question)) {
    return {
      answer: "I'm sorry, but I cannot provide investment advice, recommendations, comparisons, or opinions. I can only provide factual information about the schemes.",
      source_url: null
    };
  }

  // Check for statement download questions
  const factType = extractFactType(question);
  if (factType === 'statement_download') {
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('cams')) {
      return {
        answer: `To download capital gains/account/tax statements from CAMS, visit: ${knowledgeBase.statement_download.cams.source_url}`,
        source_url: knowledgeBase.statement_download.cams.source_url
      };
    } else if (lowerQuestion.includes('groww')) {
      return {
        answer: `To download reports and statements on Groww, visit: ${knowledgeBase.statement_download.groww.source_url}`,
        source_url: knowledgeBase.statement_download.groww.source_url
      };
    } else {
      return {
        answer: `You can download statements from CAMS at ${knowledgeBase.statement_download.cams.source_url} or from Groww at ${knowledgeBase.statement_download.groww.source_url}`,
        source_url: knowledgeBase.statement_download.groww.source_url
      };
    }
  }

  // Extract scheme and fact
  const schemeName = extractSchemeName(question);
  if (!schemeName) {
    return {
      answer: "I can only answer questions about the following Nippon India schemes: Large Cap Fund, Flexi Cap Fund, ELSS Tax Saver Fund, Balanced Advantage Fund, and Liquid Fund. Please specify which scheme you're asking about.",
      source_url: null
    };
  }

  if (!factType) {
    return {
      answer: "I can provide information about: expense ratio, exit load, minimum SIP, minimum lump sum, lock-in (for ELSS), riskometer, benchmark, and statement downloads. Please ask about one of these facts.",
      source_url: null
    };
  }

  const scheme = knowledgeBase.schemes[schemeName];
  if (!scheme || !scheme[factType]) {
    return {
      answer: `I don't have information about ${factType.replace('_', ' ')} for ${schemeName}.`,
      source_url: null
    };
  }

  const fact = scheme[factType];
  let answerText = '';

  if (factType === 'expense_ratio') {
    answerText = `The expense ratio for ${schemeName} is ${fact.direct} for Direct plan and ${fact.regular} for Regular plan.`;
  } else {
    answerText = `${schemeName}: ${fact.value}`;
  }

  return {
    answer: answerText,
    source_url: fact.source_url
  };
}

// Main CLI interface
function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Nippon India Mutual Fund FAQ Assistant');
  console.log('=====================================');
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
    rl.question('Your question: ', (question) => {
      if (question.toLowerCase().trim() === 'exit') {
        console.log('Goodbye!');
        rl.close();
        return;
      }

      if (!question.trim()) {
        askQuestion();
        return;
      }

      const result = getAnswer(question);
      console.log('\nAnswer:', result.answer);
      if (result.source_url) {
        console.log('Source:', result.source_url);
      }
      console.log('');
      askQuestion();
    });
  }

  askQuestion();
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { getAnswer, isAdviceQuestion, extractSchemeName, extractFactType };

