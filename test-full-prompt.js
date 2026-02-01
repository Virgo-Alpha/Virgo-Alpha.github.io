#!/usr/bin/env node

/**
 * Test script to see the full prompt that would be sent to the AI
 */

const { create, insertMultiple, search } = require('@orama/orama');
const fs = require('fs');
const path = require('path');

async function testFullPrompt() {
  console.log('🔍 Testing Full Prompt Generation\n');
  
  // Load knowledge base
  const kbPath = path.join(__dirname, 'assets', 'kb.json');
  const docs = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
  
  // Create Orama database
  const db = await create({
    schema: { 
      id: 'string', 
      title: 'string', 
      content: 'string', 
      source: 'string' 
    }
  });
  
  await insertMultiple(db, docs);
  
  const query = 'What are his top skills?';
  
  // Clean query like bensonbot.js does
  const cleanTerm = query.toLowerCase()
    .replace(/what are his/g, '')
    .replace(/what is his/g, '')
    .replace(/tell me about/g, '')
    .replace(/summarize/g, '')
    .replace(/his top/g, 'top')
    .replace(/his best/g, 'best')
    .replace(/[?!.]/g, '')
    .trim();
  
  // Search with same params as bensonbot.js
  const searchResult = await search(db, {
    term: cleanTerm || query,
    properties: '*',
    limit: 3,
    tolerance: 1,
    boost: {
      title: 2,
      content: 1
    }
  });
  
  const kbContext = searchResult.hits.map(hit => hit.document.content).join('\n\n');
  
  // Build the prompt like chat.js does (UPDATED VERSION)
  const SYSTEM = `You are Bensonbot, an AI assistant for Benson Mugure's portfolio website.

RULES:
- Answer questions about Benson Mugure based on the provided CONTEXT.
- The CONTEXT may contain multiple excerpts - ONLY use the excerpts that are directly relevant to the question.
- If some excerpts are about unrelated topics (articles, general concepts), IGNORE them completely.
- Focus ONLY on information that directly answers the user's question about Benson.
- If the CONTEXT doesn't contain relevant information, say so and suggest related topics.
- Be professional, concise, and enthusiastic.
- Refer to Benson in third person (he/his) when answering about him.
- Do not invent facts.`;

  const prompt = `${SYSTEM}

CONTEXT FROM BENSON'S PORTFOLIO:
${kbContext}

USER QUESTION:
${query}

Answer the question by extracting ONLY the directly relevant information from the context above. Ignore any unrelated excerpts:`;

  console.log('='.repeat(80));
  console.log('FULL PROMPT THAT WOULD BE SENT TO GEMINI:');
  console.log('='.repeat(80));
  console.log(prompt);
  console.log('='.repeat(80));
  console.log(`\nPrompt length: ${prompt.length} characters`);
  console.log(`Context length: ${kbContext.length} characters`);
}

testFullPrompt().catch(console.error);
