#!/usr/bin/env node

/**
 * Test script for the chatbot Netlify function
 * This script simulates calling the Netlify function with test queries
 */

const { handler } = require('./netlify/functions/chat.js');

// Mock environment for testing
process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test-key-for-local-testing';

const testCases = [
  {
    name: 'Query with valid context',
    query: 'What are his top skills?',
    context: `Benson Mugure is a skilled software engineer with expertise in:
- Python and Django for backend development
- JavaScript, React, and Vue.js for frontend development
- Cloud platforms including AWS and Google Cloud
- Data engineering and machine learning
- DevOps and CI/CD pipelines`
  },
  {
    name: 'Query with empty context',
    query: 'Tell me about his experience',
    context: ''
  },
  {
    name: 'Query about projects',
    query: 'What projects has he worked on?',
    context: `Projects:
1. Finamu - A fintech application for financial management
2. Menta - A mental health support platform
3. Frisque - A risk assessment tool
4. Data Engineering pipelines on AWS`
  }
];

async function runTests() {
  console.log('🤖 Testing Bensonbot Netlify Function\n');
  console.log('Note: Using mock API key for structure testing only\n');
  console.log('='.repeat(60));

  for (const testCase of testCases) {
    console.log(`\n📝 Test: ${testCase.name}`);
    console.log('Query:', testCase.query);
    console.log('Context length:', testCase.context.length);

    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({
        query: testCase.query,
        context: testCase.context
      })
    };

    try {
      const result = await handler(event, {});
      const response = JSON.parse(result.body);
      
      console.log('Status:', result.statusCode);
      if (result.statusCode === 200) {
        console.log('✅ Function executed successfully');
        console.log('Response preview:', response.answer ? response.answer.substring(0, 100) + '...' : 'No answer');
      } else {
        console.log('❌ Function returned error:', response.error);
      }
    } catch (error) {
      console.log('❌ Test failed with error:', error.message);
    }
    console.log('-'.repeat(60));
  }

  console.log('\n✨ Testing complete!');
  console.log('\nNote: To fully test with real AI responses, set GEMINI_API_KEY environment variable');
}

// Test invalid requests
async function testInvalidRequests() {
  console.log('\n🔍 Testing invalid requests\n');
  console.log('='.repeat(60));

  const invalidCases = [
    {
      name: 'GET request (should fail)',
      event: { httpMethod: 'GET' }
    },
    {
      name: 'Missing query',
      event: {
        httpMethod: 'POST',
        body: JSON.stringify({ context: 'some context' })
      }
    },
    {
      name: 'Invalid JSON',
      event: {
        httpMethod: 'POST',
        body: 'not valid json'
      }
    }
  ];

  for (const testCase of invalidCases) {
    console.log(`\n📝 Test: ${testCase.name}`);
    try {
      const result = await handler(testCase.event, {});
      console.log('Status:', result.statusCode);
      console.log(result.statusCode >= 400 ? '✅ Correctly rejected' : '❌ Should have failed');
    } catch (error) {
      console.log('✅ Correctly caught error:', error.message);
    }
    console.log('-'.repeat(60));
  }
}

// Run all tests
(async () => {
  await runTests();
  await testInvalidRequests();
})();
