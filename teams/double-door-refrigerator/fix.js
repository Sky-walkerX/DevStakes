const fs = require('fs');

const mappings = {
  'samsung magician': 'https://play-lh.googleusercontent.com/AZCOwJR9dXFjVL_YqnEhePpzlEyhsR95CGjkdvwzewGiQCayR29RSEe-cEf3WdKNfGvmbTdhPaRd__VxvW2E-Q=w240-h480-rw',
  'taiga': 'https://toppng.com/uploads/preview/taiga-logo-11609378802pe5qhhazbr.png',
  'sonarqube (community)': 'https://icons-for-free.com/iff/png/512/sonarqube-1336519700268537013.png',
  'nvidia rtx 4090': 'https://images-cdn.ubuy.com.pl/652a823904abac2439285874-nvidia-geforce-rtx-4090-founders-edition.jpg'
};

const dataFile = 'src/data.js';
const data = fs.readFileSync(dataFile, 'utf8');
const lines = data.split(/\r?\n/);

let currentTitle = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes('"title":')) {
    const match = line.match(/"title":\s*"([^"]+)"/);
    if (match) currentTitle = match[1];
  }

  if (line.includes('"image":') && currentTitle) {
    const normalizedTitle = currentTitle.toLowerCase();
    const replacement = mappings[normalizedTitle];
    if (replacement) {
      const indent = line.match(/^\s*/)[0];
      lines[i] = `${indent}"image": "${replacement}",`;
      console.log('Fixed:', currentTitle);
    }
  }
}

fs.writeFileSync(dataFile, lines.join('\n'));
console.log(`Update complete.`);
