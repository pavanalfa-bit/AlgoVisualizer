const fs = require('fs');
let content = fs.readFileSync('src/components/animations/ThreeSum.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
content = content.replace(/\\n/g, '\n');
fs.writeFileSync('src/components/animations/ThreeSum.tsx', content);
