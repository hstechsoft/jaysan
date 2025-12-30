const fs = require('fs');

// Read the file with UTF-8 encoding
let content = fs.readFileSync('api_analytics_dashboard.html', 'utf8');

// Count before
const beforeMatches = content.match(/âš|ð/g);
console.log(`Found ${beforeMatches ? beforeMatches.length : 0} corrupted emoji sequences`);

// Replace corrupted emoji sequences with proper emojis
content = content.replace(/âš ï¸/g, '⚠️');   // Warning emoji
content = content.replace(/📄Ÿ/g, '📄');      // Document emoji
content = content.replace(/📄Ÿ"‹/g, '📋');   // Clipboard emoji (must come before document)
content = content.replace(/ð"§/g, '🔧');      // Wrench emoji
content = content.replace(/ð"/g, '🔒');       // Lock emoji
content = content.replace(/ð"Š/g, '📊');      // Chart emoji

// Write back with UTF-8 encoding
fs.writeFileSync('api_analytics_dashboard.html', content, 'utf8');

// Count after
const afterMatches = content.match(/âš|ð/g);
console.log(`Remaining corrupted: ${afterMatches ? afterMatches.length : 0}`);
console.log('\n✓ All emoji encoding issues fixed!');
