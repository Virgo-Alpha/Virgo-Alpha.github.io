const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

const SOURCE_DIR = path.join(__dirname, '../source');
const DATA_DIR = path.join(__dirname, '../../_data');
const OUTPUT_FILE = path.join(__dirname, '../../assets/kb.json');

// Ensure assets directory exists
const assetsDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

function chunkText(text, maxLength = 1000) {
  const chunks = [];
  let currentChunk = '';
  
  const sentences = text.split(/(?<=[.?!])\s+/);
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

async function buildKB() {
  console.log('Building Knowledge Base...');
  const documents = [];
  let id = 0;

  // 1. Process Markdown files in _bensonbot/source
  const mdFiles = glob.sync(`${SOURCE_DIR}/*.md`);
  for (const file of mdFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const { data, content: markdownBody } = matter(content);
      const filename = path.basename(file, '.md');
      
      const cleanText = markdownBody
        .replace(/<[^>]*>/g, ' ') // Strip HTML tags
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/[#*`]/g, '')
        .replace(/\n+/g, ' ')
        .trim();

      const chunks = chunkText(cleanText);
      chunks.forEach((chunk, index) => {
        documents.push({
          id: `doc-${id++}`,
          source: filename,
          title: data.title || filename,
          content: chunk,
          section: index
        });
      });
    } catch (err) {
      console.error(`Error processing markdown ${file}:`, err.message);
    }
  }

  // 2. Process YAML/YML files in _data
  const yamlFiles = glob.sync(`${DATA_DIR}/*.{yaml,yml}`);
  for (const file of yamlFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const filename = path.basename(file);
      
      // Use gray-matter with explicit error handling
      let parsed;
      try {
        parsed = matter(`---\n${content}\n---`).data;
      } catch (yamlErr) {
        console.error(`YAML Syntax Error in ${filename}:`, yamlErr.reason || yamlErr.message);
        continue; // Skip this file and move to next
      }
      
      // Flatten the YAML into strings for indexing
      const stringified = JSON.stringify(parsed, null, 2)
        .replace(/[{}":,\[\]\n]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const chunks = chunkText(stringified);
      chunks.forEach((chunk, index) => {
        documents.push({
          id: `doc-${id++}`,
          source: `data/${filename}`,
          title: `Data: ${filename}`,
          content: chunk,
          section: index
        });
      });
      console.log(`Successfully processed data file: ${filename}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(documents, null, 2));
  console.log(`Knowledge base built with ${documents.length} chunks.`);
}

buildKB();
