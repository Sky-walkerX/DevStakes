#!/usr/bin/env node
const fs = require('fs');

let data = fs.readFileSync('src/data.js', 'utf8');

// High quality Unsplash images by category/brand
const imageMap = {
  // SSDs
  'Samsung 990 Pro': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=400&fit=crop',
  'WD Black SN850X': 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=600&h=400&fit=crop',
  'Crucial T700': 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=600&h=400&fit=crop',
  'Kingston KC3000': 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&h=400&fit=crop',
  'Sabrent Rocket 4 Plus': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=400&fit=crop&q=90',
  'TeamGroup MP34': 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=600&h=400&fit=crop&q=90',
  'Crucial MX500': 'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=600&h=400&fit=crop&q=90',
  'Corsair MP600 Pro': 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&h=400&fit=crop&q=90',

  // GPUs
  'NVIDIA RTX 4090': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=400&fit=crop',
  'AMD Radeon RX 7900 XTX': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=400&fit=crop',
  'NVIDIA RTX 4080 Super': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=400&fit=crop&q=90',
  'AMD Radeon RX 7800 XT': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=400&fit=crop&q=90',
  'NVIDIA RTX 4070 Ti Super': 'https://images.unsplash.com/photo-1555618254-5e28e2e0c76f?w=600&h=400&fit=crop',
  'AMD Radeon RX 7600': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=400&fit=crop&q=85',
  'NVIDIA RTX 3060': 'https://images.unsplash.com/photo-1555618254-5e28e2e0c76f?w=600&h=400&fit=crop&q=90',
  'Intel Arc A770': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=400&fit=crop&q=85',

  // CPUs
  'AMD Ryzen 7 7800X3D': 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&h=400&fit=crop',
  'Intel Core i9-14900K': 'https://images.unsplash.com/photo-1592664474505-51c549ad15c5?w=600&h=400&fit=crop',
  'AMD Ryzen 9 7950X': 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&h=400&fit=crop&q=90',
  'Intel Core i5-13600K': 'https://images.unsplash.com/photo-1592664474505-51c549ad15c5?w=600&h=400&fit=crop&q=90',
  'AMD Ryzen 5 7600X': 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&h=400&fit=crop&q=85',
  'Intel Core i7-14700K': 'https://images.unsplash.com/photo-1592664474505-51c549ad15c5?w=600&h=400&fit=crop&q=85',
  'AMD Ryzen 5 5600X': 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&h=400&fit=crop&q=80',
};

// Tool images - code/dev themed
const toolImages = [
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&h=400&fit=crop',
];

// RAM images
const ramImages = [
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1592664474505-51c549ad15c5?w=600&h=400&fit=crop&q=75',
  'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&h=400&fit=crop&q=75',
  'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&h=400&fit=crop&q=90',
];

// Parse product data to find titles and their image lines
const lines = data.split('\n');
let currentTitle = '';
let toolIdx = 0;
let ramIdx = 0;

for (let i = 0; i < lines.length; i++) {
  const titleMatch = lines[i].match(/"title":\s*"([^"]+)"/);
  if (titleMatch) {
    currentTitle = titleMatch[1];
  }

  const imageMatch = lines[i].match(/"image":\s*"https:\/\/logo\.clearbit\.com\/[^"]+"/);
  if (imageMatch && currentTitle) {
    let newUrl;
    if (imageMap[currentTitle]) {
      newUrl = imageMap[currentTitle];
    } else {
      // Check if category is tools or RAM by context
      // Look backwards for category
      let cat = '';
      for (let j = i; j > Math.max(0, i - 20); j--) {
        const catMatch = lines[j].match(/"category":\s*"([^"]+)"/);
        if (catMatch) {
          cat = catMatch[1];
          break;
        }
      }
      if (cat === 'TOOLS') {
        newUrl = toolImages[toolIdx % toolImages.length];
        toolIdx++;
      } else if (cat === 'MEMORY (RAM)') {
        newUrl = ramImages[ramIdx % ramImages.length];
        ramIdx++;
      } else {
        newUrl = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop';
      }
    }
    lines[i] = lines[i].replace(/"image":\s*"[^"]+"/, `"image": "${newUrl}"`);
  }
}

data = lines.join('\n');
fs.writeFileSync('src/data.js', data);
console.log('Done! Replaced all product images.');
