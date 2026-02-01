#!/usr/bin/env node

/**
 * Test script to check what context is retrieved by Orama search
 */

const { create, insertMultiple, search } = require('@orama/orama');
const fs = require('fs');
const path = require('path');

async function testSearch() {
  console.log('🔍 Testing Orama Search Context Retrieval\n');
  
  // Load knowledge base
  const kbPath = path.join(__dirname, 'assets', 'kb.json');
  const docs = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
  
  console.log(`Loaded ${docs.length} documents from knowledge base\n`);
  
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
  console.log('✅ Database indexed\n');
  
  // Test queries
  const testQueries = [
    'What are his top skills?',
    'top skills',
    'skills',
    'AWS Python Django',
    'experience'
  ];
  
  for (const query of testQueries) {
    console.log('='.repeat(60));
    console.log(`Query: "${query}"`);
    console.log('='.repeat(60));
    
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
    
    console.log(`Cleaned term: "${cleanTerm}"\n`);
    
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
    
    console.log(`Found ${searchResult.hits.length} results:\n`);
    
    searchResult.hits.forEach((hit, idx) => {
      console.log(`${idx + 1}. Source: ${hit.document.source}`);
      console.log(`   Title: ${hit.document.title}`);
      console.log(`   Score: ${hit.score}`);
      console.log(`   Content preview: ${hit.document.content.substring(0, 150)}...`);
      console.log();
    });
    
    if (searchResult.hits.length > 0) {
      const context = searchResult.hits.map(hit => hit.document.content).join('\n\n');
      console.log(`Context length that would be sent to AI: ${context.length} characters`);
      console.log(`\nFull context that would be sent:\n`);
      console.log(context.substring(0, 500) + '...\n');
    } else {
      console.log('❌ No context found!\n');
    }
  }
}

testSearch().catch(console.error);
