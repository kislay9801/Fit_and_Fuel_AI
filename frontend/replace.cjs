const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  { regex: /bg-\[#f8f9ff\](\/\d+)?/g, replace: 'bg-slate-50$1' },
  { regex: /text-\[#0b1c30\]/g, replace: 'text-slate-900' },
  { regex: /text-\[#424656\]/g, replace: 'text-slate-600' },
  { regex: /text-\[#727687\]/g, replace: 'text-slate-500' },
  { regex: /bg-\[#0050cb\](\/\d+)?/g, replace: 'bg-blue-600$1' },
  { regex: /text-\[#0050cb\]/g, replace: 'text-blue-600' },
  { regex: /border-\[#0050cb\](\/\d+)?/g, replace: 'border-blue-600$1' },
  { regex: /bg-\[#e5eeff\]/g, replace: 'bg-slate-100' }, // Secondary Surface
  { regex: /border-\[#c2c6d8\]/g, replace: 'border-slate-200' },
  { regex: /border-\[#e2e8f0\]/g, replace: 'border-slate-200' },
  { regex: /bg-\[#6cf8bb\](\/\d+)?/g, replace: 'bg-emerald-100$1' },
  { regex: /text-\[#006c49\]/g, replace: 'text-emerald-700' },
  { regex: /border-\[#006c49\]/g, replace: 'border-emerald-700' },
  { regex: /bg-\[#ba1a1a\]/g, replace: 'bg-red-500' },
  { regex: /text-\[#ba1a1a\]/g, replace: 'text-red-500' },
  { regex: /bg-\[#ffdbca\]/g, replace: 'bg-amber-100' },
  { regex: /text-\[#954000\]/g, replace: 'text-amber-700' },
  { regex: /bg-\[#dce9ff\]/g, replace: 'bg-slate-100' }, // Use slate-100 for light secondary surfaces
  { regex: /border-\[#b3c5ff\]/g, replace: 'border-slate-200' },
  { regex: /style=\{\{\s*fontFamily:\s*'Montserrat, sans-serif'\s*\}\}/g, replace: '' },
  { regex: /style=\{\{\s*fontFamily:\s*'Inter, sans-serif'\s*\}\}/g, replace: '' },
  { regex: /style=\{\{\s*fontFamily:\s*'Montserrat, sans-serif',\s*(.*?)\}\}/g, replace: 'style={{ $1 }}' },
  // Clean up empty style objects left behind
  { regex: /style=\{\{\s*\}\}/g, replace: '' },
  { regex: /className="([^"]*)style="([^"]*)"/g, replace: 'className="$1"' }, // Just in case
];

function processDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      replacements.forEach(r => {
        content = content.replace(r.regex, r.replace);
      });
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log('Replacement complete.');
