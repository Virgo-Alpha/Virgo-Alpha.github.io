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
  const EXCLUDED_FILES = ['articles.md', 'projects.md', 'resume.md', 'certification.md'];

  for (const file of mdFiles) {
    try {
      const filename = path.basename(file);
      if (EXCLUDED_FILES.includes(filename)) {
        console.log(`Skipping template file: ${filename}`);
        continue;
      }

      const content = fs.readFileSync(file, 'utf8');
      const { data, content: markdownBody } = matter(content);
      const fileBasename = path.basename(file, '.md');
      
      const cleanText = markdownBody
        .replace(/{%.*?%}/g, ' ') // Strip Liquid tags
        .replace(/{{.*?}}/g, ' ') // Strip Liquid variables
        .replace(/<[^>]*>/g, ' ') // Strip HTML tags
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/[#*`]/g, '')
        .replace(/\n+/g, ' ')
        .trim();

      if (!cleanText) continue;

      const chunks = chunkText(cleanText);
      chunks.forEach((chunk, index) => {
        documents.push({
          id: `doc-${id++}`,
          source: fileBasename,
          title: data.title || fileBasename,
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
      const category = filename.split('.')[0];
      
      let parsed;
      try {
        parsed = matter(`---\n${content}\n---`).data;
      } catch (yamlErr) {
        console.error(`YAML Syntax Error in ${filename}:`, yamlErr.reason || yamlErr.message);
        continue;
      }
      
      // Better indexing for YAML: turn items into descriptive sentences
      let items = [];
      if (Array.isArray(parsed)) {
        items = parsed;
      } else if (parsed && typeof parsed === 'object') {
        // Handle files like experiences.yaml where items are in an 'items' key
        items = parsed.items || [parsed];
      }

      items.forEach((item, itemIdx) => {
        let entryText = `Category: ${category}. `;
        
        // Add specific field labels to help search
        if (item.role) entryText += `Role / Position / Job Title: ${item.role}. `;
        if (item.company) entryText += `Company / Organization: ${item.company}. `;
        if (item.title) entryText += `Project Title: ${item.title}. `;
        if (item.description) entryText += `Description: ${item.description}. `;
        if (item.stack) entryText += `Tech Stack / Technologies: ${item.stack}. `;
        if (item.details && Array.isArray(item.details)) {
          entryText += `Details: ${item.details.join(' ')} `;
        }
        
        // Fallback for other fields
        Object.entries(item).forEach(([key, value]) => {
          if (!['role', 'company', 'title', 'description', 'stack', 'details', 'image', 'preview_gif', 'screenshot', 'link', 'github', 'devto', 'slides'].includes(key)) {
            if (typeof value === 'string' || typeof value === 'number') {
              entryText += `${key}: ${value}. `;
            }
          }
        });

        documents.push({
          id: `doc-${id++}`,
          source: `data/${filename}`,
          title: item.title || item.role || item.name || `Data: ${filename}`,
          content: entryText.trim(),
          section: itemIdx
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
