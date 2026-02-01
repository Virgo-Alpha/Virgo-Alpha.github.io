const query = 'What are his top skills?';
const step1 = query.toLowerCase();
console.log('Step 1 (lowercase):', step1);
const step2 = step1.replace(/what are his/g, '');
console.log('Step 2 (remove what are his):', step2);
const step3 = step2.replace(/[?!.]/g, '');
console.log('Step 3 (remove punctuation):', step3);
const step4 = step3.trim();
console.log('Step 4 (trim):', step4);
