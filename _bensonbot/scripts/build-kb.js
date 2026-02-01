const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

const SOURCE_DIR = path.join(__dirname, '../source');
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
  const files = glob.sync(`${SOURCE_DIR}/*.md`);
  const documents = [];
  let id = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const { data, content: markdownBody } = matter(content);
    const filename = path.basename(file, '.md');
    
    // Simple cleanup: remove markdown headings and links for cleaner text
    const cleanText = markdownBody
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links, keep text
      .replace(/[#*`]/g, '') // Remove basic markdown syntax
      .replace(/\n+/g, ' ') // Collapse newlines
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
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(documents, null, 2));
  console.log(`Knowledge base built with ${documents.length} chunks.`);
}

buildKB();
