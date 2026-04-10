const fs = require('fs');
const path = require('path');

const generateReviews = (title, category) => {
  const numReviews = Math.floor(Math.random() * 3) + 4; // 4 to 6 for the "latest reviews" summary
  
  const positiveAdjectives = ["Incredible", "Outstanding", "Solid", "Fantastic", "Great", "Excellent", "Brilliant"];
  const neutralAdjectives = ["Decent", "Okay", "Average", "Good enough", "Acceptable"];
  const features = {
    'SSD': ["speed", "Storage IO", "boot times", "file transfer times", "cooling"],
    'GRAPHICS CARDS': ["frame rates", "ray tracing", "1440p performance", "4K capability", "driver stability"],
    'CPUs': ["multitasking", "gaming performance", "render times", "power efficiency", "temperatures"],
    'TOOLS': ["UI", "accuracy", "speed of scan", "feature set", "reliability"],
    'MEMORY (RAM)': ["latency", "stutter reduction", "RGB lighting", "overclocking", "EXPO profiles"]
  };
  
  const featureList = features[category] || ["quality", "performance", "build", "value"];
  
  const reviews = [];
  for (let i = 0; i < numReviews; i++) {
    const isPositive = Math.random() > 0.15; // 85% mostly positive
    const rating = isPositive ? (Math.random() > 0.4 ? 5 : 4) : (Math.random() > 0.5 ? 3 : 2);
    
    const adj = isPositive 
      ? positiveAdjectives[Math.floor(Math.random() * positiveAdjectives.length)] 
      : neutralAdjectives[Math.floor(Math.random() * neutralAdjectives.length)];
      
    const feat = featureList[Math.floor(Math.random() * featureList.length)];
    const feat2 = featureList[Math.floor(Math.random() * featureList.length)];
    
    let comment = ``;
    if (rating === 5) {
      comment = `${adj} product! The ${feat} is top tier. I've also noticed great improvements in ${feat2}. Highly recommend.`;
    } else if (rating === 4) {
      comment = `Very ${adj.toLowerCase()} choice. The ${feat} is definitely a plus. However, the ${feat2} could be a bit better. Overall very happy.`;
    } else {
      comment = `${adj} for the price, but fell short on ${feat}. Maybe look around before committing.`;
    }
    
    reviews.push({
      user: `User${Math.floor(Math.random() * 90000) + 10000}`,
      rating,
      comment
    });
  }
  return reviews;
};

const calcOverall = (scores) => {
  const vals = Object.values(scores);
  if (vals.length === 0) return 0;
  return Math.round(vals.reduce((a,b)=>a+b, 0) / vals.length);
};

const generateUserBenchmarks = (category, overall) => {
  const variance = () => (Math.random() * 0.2 - 0.1); 
  const val = (base, suffix) => Math.round(base * (1 + variance() + (overall - 85)/100)) + suffix;
  const floatVal = (base, suffix) => (base * (1 + variance() + (overall - 85)/100)).toFixed(1) + suffix;

  if (category === 'SSD') {
    return { 'CDM Seq Read': val(7000, ' MB/s'), 'CDM Seq Write': val(6500, ' MB/s'), 'Random 4K Read': val(1000, 'K IOPS'), 'Avg Load Temp': val(65, '°C') };
  } else if (category === 'GRAPHICS CARDS') {
    return { '3DMark TimeSpy': val(25000, ' pts'), 'Port Royal': val(15000, ' pts'), 'Cyberpunk 4K FPS': val(85, ' fps'), 'Alan Wake 2 1440p': val(110, ' fps') };
  } else if (category === 'CPUs') {
    return { 'Cinebench R23 Multi': val(35000, ' pts'), 'Cinebench R23 Single': val(2100, ' pts'), 'Blender Classroom': floatVal(4.5, ' mins'), 'Avg Load Temp': val(80, '°C') };
  } else if (category === 'TOOLS') {
    return { 'Value for Money': val(92, '%'), 'Feature Richness': val(88, '%'), 'Ease of Deployment': val(95, '%'), 'Community Support': val(90, '%') };
  } else if (category === 'MEMORY (RAM)') {
    return { 'AIDA64 Read': val(85000, ' MB/s'), 'AIDA64 Latency': floatVal(65, ' ns'), 'Y-Cruncher PI': floatVal(12, ' sec') };
  }
  return { 'User Satisfaction': val(90, '%'), 'Reliability': val(95, '%') };
};

const generateRatingStats = (overall) => {
  const total = Math.floor(Math.random() * 8000) + 2000;
  const r5 = Math.floor(total * (overall / 100) * 0.85);
  const r4 = Math.floor(total * 0.10);
  const r3 = Math.floor(total * 0.03);
  const r2 = Math.floor(total * 0.01);
  const r1 = total - (r5 + r4 + r3 + r2);
  const avg = ((r5*5 + r4*4 + r3*3 + r2*2 + r1*1) / total).toFixed(1);
  return { total, 5: r5, 4: r4, 3: r3, 2: r2, 1: r1, avg };
};

const getURL = (store, query) => {
  const q = encodeURIComponent(query);
  if (store === 'amazon') return `https://www.amazon.com/s?k=${q}`;
  if (store === 'flipkart') return `https://www.flipkart.com/search?q=${q}`;
  return `https://www.google.com/search?q=${q}+official+site`;
}

const productsD = [
  // SSDs
  { id: 101, title: 'Samsung 990 Pro', subtitle: 'Leading PCIe 4.0 NVMe', category: 'SSD', isNew: true, features: { Capacity: '2TB', Speed: '7450 MB/s' },
    specifications: { Capacity: '2TB', 'Read Speed': '7450 MB/s', 'Write Speed': '6900 MB/s', Interface: 'PCIe 4.0 x4', FormFactor: 'M.2 2280', Endurance: '1200 TBW' },
    scores: { Speed: 98, Reliability: 96, Value: 85, Thermal: 92 },
    prices: { amazon: { price: '$159', link: getURL('amazon', 'Samsung 990 Pro 2TB') }, flipkart: { price: '₹14,499', link: getURL('flipkart', 'Samsung 990 Pro 2TB') }, official: { price: '$169', link: getURL('official', 'Samsung 990 Pro') } }
  },
  { id: 102, title: 'WD Black SN850X', subtitle: 'High performance gaming SSD', category: 'SSD', isNew: false, features: { Capacity: '2TB', Speed: '7300 MB/s' },
    specifications: { Capacity: '2TB', 'Read Speed': '7300 MB/s', 'Write Speed': '6600 MB/s', Interface: 'PCIe 4.0 x4', FormFactor: 'M.2 2280', Endurance: '1200 TBW' },
    scores: { Speed: 96, Reliability: 93, Value: 89, Thermal: 88 },
    prices: { amazon: { price: '$149', link: getURL('amazon', 'WD Black SN850X 2TB') }, flipkart: { price: '₹13,999', link: getURL('flipkart', 'WD Black SN850X 2TB') }, official: { price: '$159', link: getURL('official', 'WD Black SN850X') } }
  },
  { id: 103, title: 'Crucial T700', subtitle: 'Next-gen PCIe 5.0 speed', category: 'SSD', isNew: true, features: { Capacity: '2TB', Speed: '12400 MB/s' },
    specifications: { Capacity: '2TB', 'Read Speed': '12400 MB/s', 'Write Speed': '11800 MB/s', Interface: 'PCIe 5.0 x4', FormFactor: 'M.2 2280', Endurance: '1200 TBW' },
    scores: { Speed: 100, Reliability: 90, Value: 75, Thermal: 70 },
    prices: { amazon: { price: '$269', link: getURL('amazon', 'Crucial T700 2TB') }, flipkart: { price: '₹25,999', link: getURL('flipkart', 'Crucial T700 2TB') }, official: { price: '$289', link: getURL('official', 'Crucial T700') } }
  },
  { id: 104, title: 'Kingston KC3000', subtitle: 'Reliable high-speed storage', category: 'SSD', isNew: false, features: { Capacity: '1TB', Speed: '7000 MB/s' },
    specifications: { Capacity: '1TB', 'Read Speed': '7000 MB/s', 'Write Speed': '6000 MB/s', Interface: 'PCIe 4.0 x4', FormFactor: 'M.2 2280', Endurance: '800 TBW' },
    scores: { Speed: 92, Reliability: 94, Value: 95, Thermal: 91 },
    prices: { amazon: { price: '$85', link: getURL('amazon', 'Kingston KC3000 1TB') }, flipkart: { price: '₹7,999', link: getURL('flipkart', 'Kingston KC3000 1TB') }, official: { price: '$95', link: getURL('official', 'Kingston KC3000') } }
  },
  { id: 105, title: 'Sabrent Rocket 4 Plus', subtitle: 'Enthusiast level performance', category: 'SSD', isNew: false, features: { Capacity: '4TB', Speed: '7100 MB/s' },
    specifications: { Capacity: '4TB', 'Read Speed': '7100 MB/s', 'Write Speed': '6600 MB/s', Interface: 'PCIe 4.0 x4', FormFactor: 'M.2 2280', Endurance: '2800 TBW' },
    scores: { Speed: 94, Reliability: 95, Value: 82, Thermal: 85 },
    prices: { amazon: { price: '$399', link: getURL('amazon', 'Sabrent Rocket 4 Plus 4TB') }, flipkart: { price: '₹38,000', link: getURL('flipkart', 'Sabrent Rocket 4 Plus 4TB') }, official: { price: '$420', link: getURL('official', 'Sabrent Rocket 4 Plus') } }
  },
  { id: 106, title: 'TeamGroup MP34', subtitle: 'Affordable NVMe option', category: 'SSD', isNew: false, features: { Capacity: '1TB', Speed: '3400 MB/s' },
    specifications: { Capacity: '1TB', 'Read Speed': '3400 MB/s', 'Write Speed': '2900 MB/s', Interface: 'PCIe 3.0 x4', FormFactor: 'M.2 2280', Endurance: '1660 TBW' },
    scores: { Speed: 75, Reliability: 90, Value: 98, Thermal: 95 },
    prices: { amazon: { price: '$49', link: getURL('amazon', 'TeamGroup MP34 1TB') }, flipkart: { price: '₹4,500', link: getURL('flipkart', 'TeamGroup MP34 1TB') }, official: { price: '$55', link: getURL('official', 'TeamGroup MP34') } }
  },
  { id: 107, title: 'Crucial MX500', subtitle: 'Classic SATA SSD', category: 'SSD', isNew: false, features: { Capacity: '1TB', Speed: '560 MB/s' },
    specifications: { Capacity: '1TB', 'Read Speed': '560 MB/s', 'Write Speed': '510 MB/s', Interface: 'SATA III', FormFactor: '2.5 inch', Endurance: '360 TBW' },
    scores: { Speed: 50, Reliability: 98, Value: 95, Thermal: 99 },
    prices: { amazon: { price: '$55', link: getURL('amazon', 'Crucial MX500 1TB') }, flipkart: { price: '₹4,999', link: getURL('flipkart', 'Crucial MX500 1TB') }, official: { price: '$60', link: getURL('official', 'Crucial MX500') } }
  },
  { id: 108, title: 'Corsair MP600 Pro', subtitle: 'Heatsink equipped NVMe', category: 'SSD', isNew: false, features: { Capacity: '2TB', Speed: '7100 MB/s' },
    specifications: { Capacity: '2TB', 'Read Speed': '7100 MB/s', 'Write Speed': '6800 MB/s', Interface: 'PCIe 4.0 x4', FormFactor: 'M.2 2280 w/ Heatsink', Endurance: '1400 TBW' },
    scores: { Speed: 94, Reliability: 96, Value: 85, Thermal: 98 },
    prices: { amazon: { price: '$155', link: getURL('amazon', 'Corsair MP600 Pro 2TB') }, flipkart: { price: '₹14,800', link: getURL('flipkart', 'Corsair MP600 Pro 2TB') }, official: { price: '$165', link: getURL('official', 'Corsair MP600 Pro') } }
  },

  // Graphics Cards
  { id: 201, title: 'NVIDIA RTX 4090', subtitle: 'The ultimate GPU', category: 'GRAPHICS CARDS', isNew: false, features: { VRAM: '24GB GDDR6X', Power: '450W' },
    specifications: { Architecture: 'Ada Lovelace', CudaCores: '16384', VRAM: '24GB GDDR6X', 'Boost Clock': '2.52 GHz', Power: '450W', Bandwidth: '1008 GB/s' },
    scores: { Gaming: 100, RayTracing: 100, Value: 60, Efficiency: 90 },
    prices: { amazon: { price: '$1599', link: getURL('amazon', 'NVIDIA RTX 4090') }, flipkart: { price: '₹1,55,000', link: getURL('flipkart', 'NVIDIA RTX 4090') }, official: { price: '$1599', link: getURL('official', 'NVIDIA RTX 4090') } }
  },
  { id: 202, title: 'AMD Radeon RX 7900 XTX', subtitle: 'Flagship AMD performance', category: 'GRAPHICS CARDS', isNew: false, features: { VRAM: '24GB GDDR6', Power: '355W' },
    specifications: { Architecture: 'RDNA 3', StreamProcessors: '6144', VRAM: '24GB GDDR6', 'Boost Clock': '2.50 GHz', Power: '355W', Bandwidth: '960 GB/s' },
    scores: { Gaming: 96, RayTracing: 82, Value: 85, Efficiency: 88 },
    prices: { amazon: { price: '$950', link: getURL('amazon', 'AMD Radeon RX 7900 XTX') }, flipkart: { price: '₹95,000', link: getURL('flipkart', 'AMD Radeon RX 7900 XTX') }, official: { price: '$999', link: getURL('official', 'AMD Radeon RX 7900 XTX') } }
  },
  { id: 203, title: 'NVIDIA RTX 4080 Super', subtitle: 'High-end 4K gaming', category: 'GRAPHICS CARDS', isNew: true, features: { VRAM: '16GB GDDR6X', Power: '320W' },
    specifications: { Architecture: 'Ada Lovelace', CudaCores: '10240', VRAM: '16GB GDDR6X', 'Boost Clock': '2.55 GHz', Power: '320W', Bandwidth: '736 GB/s' },
    scores: { Gaming: 94, RayTracing: 95, Value: 82, Efficiency: 94 },
    prices: { amazon: { price: '$999', link: getURL('amazon', 'NVIDIA RTX 4080 Super') }, flipkart: { price: '₹99,999', link: getURL('flipkart', 'NVIDIA RTX 4080 Super') }, official: { price: '$999', link: getURL('official', 'NVIDIA RTX 4080 Super') } }
  },
  { id: 204, title: 'AMD Radeon RX 7800 XT', subtitle: '1440p sweet spot', category: 'GRAPHICS CARDS', isNew: true, features: { VRAM: '16GB GDDR6', Power: '263W' },
    specifications: { Architecture: 'RDNA 3', StreamProcessors: '3840', VRAM: '16GB GDDR6', 'Boost Clock': '2.43 GHz', Power: '263W', Bandwidth: '624 GB/s' },
    scores: { Gaming: 86, RayTracing: 70, Value: 95, Efficiency: 85 },
    prices: { amazon: { price: '$499', link: getURL('amazon', 'AMD Radeon RX 7800 XT') }, flipkart: { price: '₹47,000', link: getURL('flipkart', 'AMD Radeon RX 7800 XT') }, official: { price: '$499', link: getURL('official', 'AMD Radeon RX 7800 XT') } }
  },
  { id: 205, title: 'NVIDIA RTX 4070 Ti Super', subtitle: 'Premium 1440p / Entry 4K', category: 'GRAPHICS CARDS', isNew: true, features: { VRAM: '16GB GDDR6X', Power: '285W' },
    specifications: { Architecture: 'Ada Lovelace', CudaCores: '8448', VRAM: '16GB GDDR6X', 'Boost Clock': '2.61 GHz', Power: '285W', Bandwidth: '672 GB/s' },
    scores: { Gaming: 89, RayTracing: 90, Value: 88, Efficiency: 92 },
    prices: { amazon: { price: '$799', link: getURL('amazon', 'NVIDIA RTX 4070 Ti Super') }, flipkart: { price: '₹75,000', link: getURL('flipkart', 'NVIDIA RTX 4070 Ti Super') }, official: { price: '$799', link: getURL('official', 'NVIDIA RTX 4070 Ti Super') } }
  },
  { id: 206, title: 'AMD Radeon RX 7600', subtitle: 'Budget 1080p gaming', category: 'GRAPHICS CARDS', isNew: false, features: { VRAM: '8GB GDDR6', Power: '165W' },
    specifications: { Architecture: 'RDNA 3', StreamProcessors: '2048', VRAM: '8GB GDDR6', 'Boost Clock': '2.65 GHz', Power: '165W', Bandwidth: '288 GB/s' },
    scores: { Gaming: 75, RayTracing: 50, Value: 92, Efficiency: 89 },
    prices: { amazon: { price: '$259', link: getURL('amazon', 'AMD Radeon RX 7600') }, flipkart: { price: '₹24,900', link: getURL('flipkart', 'AMD Radeon RX 7600') }, official: { price: '$269', link: getURL('official', 'AMD Radeon RX 7600') } }
  },
  { id: 207, title: 'NVIDIA RTX 3060', subtitle: 'Most popular mainstream GPU', category: 'GRAPHICS CARDS', isNew: false, features: { VRAM: '12GB GDDR6', Power: '170W' },
    specifications: { Architecture: 'Ampere', CudaCores: '3584', VRAM: '12GB GDDR6', 'Boost Clock': '1.78 GHz', Power: '170W', Bandwidth: '360 GB/s' },
    scores: { Gaming: 72, RayTracing: 65, Value: 90, Efficiency: 85 },
    prices: { amazon: { price: '$280', link: getURL('amazon', 'NVIDIA RTX 3060') }, flipkart: { price: '₹26,000', link: getURL('flipkart', 'NVIDIA RTX 3060') }, official: { price: '$329', link: getURL('official', 'NVIDIA RTX 3060') } }
  },
  { id: 208, title: 'Intel Arc A770', subtitle: 'Intel\'s flagship entry', category: 'GRAPHICS CARDS', isNew: false, features: { VRAM: '16GB GDDR6', Power: '225W' },
    specifications: { Architecture: 'Alchemist', XeCores: '32', VRAM: '16GB GDDR6', 'Boost Clock': '2.10 GHz', Power: '225W', Bandwidth: '512 GB/s' },
    scores: { Gaming: 76, RayTracing: 78, Value: 89, Efficiency: 75 },
    prices: { amazon: { price: '$290', link: getURL('amazon', 'Intel Arc A770') }, flipkart: { price: '₹28,500', link: getURL('flipkart', 'Intel Arc A770') }, official: { price: '$349', link: getURL('official', 'Intel Arc A770') } }
  },

  // CPUs
  { id: 301, title: 'AMD Ryzen 7 7800X3D', subtitle: 'Best gaming CPU', category: 'CPUs', isNew: false, features: { Cores: '8C/16T', Boost: '5.0 GHz' },
    specifications: { Cores: '8', Threads: '16', 'Base Clock': '4.2 GHz', 'Boost Clock': '5.0 GHz', 'L3 Cache': '96MB (3D V-Cache)', TDP: '120W' },
    scores: { Gaming: 100, Productivity: 82, Value: 95, Efficiency: 98 },
    prices: { amazon: { price: '$369', link: getURL('amazon', 'AMD Ryzen 7 7800X3D') }, flipkart: { price: '₹35,000', link: getURL('flipkart', 'AMD Ryzen 7 7800X3D') }, official: { price: '$449', link: getURL('official', 'AMD Ryzen 7 7800X3D') } }
  },
  { id: 302, title: 'Intel Core i9-14900K', subtitle: 'Ultimate hybrid performance', category: 'CPUs', isNew: true, features: { Cores: '24C/32T', Boost: '6.0 GHz' },
    specifications: { Cores: '24 (8P+16E)', Threads: '32', 'Base Clock': '3.2 GHz', 'Boost Clock': '6.0 GHz', 'L3 Cache': '36MB', TDP: '125W (253W Max)' },
    scores: { Gaming: 98, Productivity: 100, Value: 75, Efficiency: 70 },
    prices: { amazon: { price: '$549', link: getURL('amazon', 'Intel Core i9-14900K') }, flipkart: { price: '₹53,000', link: getURL('flipkart', 'Intel Core i9-14900K') }, official: { price: '$589', link: getURL('official', 'Intel Core i9-14900K') } }
  },
  { id: 303, title: 'AMD Ryzen 9 7950X', subtitle: 'Top tier productivity', category: 'CPUs', isNew: false, features: { Cores: '16C/32T', Boost: '5.7 GHz' },
    specifications: { Cores: '16', Threads: '32', 'Base Clock': '4.5 GHz', 'Boost Clock': '5.7 GHz', 'L3 Cache': '64MB', TDP: '170W' },
    scores: { Gaming: 90, Productivity: 99, Value: 85, Efficiency: 88 },
    prices: { amazon: { price: '$530', link: getURL('amazon', 'AMD Ryzen 9 7950X') }, flipkart: { price: '₹51,000', link: getURL('flipkart', 'AMD Ryzen 9 7950X') }, official: { price: '$699', link: getURL('official', 'AMD Ryzen 9 7950X') } }
  },
  { id: 304, title: 'Intel Core i5-13600K', subtitle: 'Value and performance', category: 'CPUs', isNew: false, features: { Cores: '14C/20T', Boost: '5.1 GHz' },
    specifications: { Cores: '14 (6P+8E)', Threads: '20', 'Base Clock': '3.5 GHz', 'Boost Clock': '5.1 GHz', 'L3 Cache': '24MB', TDP: '125W (181W Max)' },
    scores: { Gaming: 92, Productivity: 88, Value: 96, Efficiency: 85 },
    prices: { amazon: { price: '$280', link: getURL('amazon', 'Intel Core i5-13600K') }, flipkart: { price: '₹27,500', link: getURL('flipkart', 'Intel Core i5-13600K') }, official: { price: '$319', link: getURL('official', 'Intel Core i5-13600K') } }
  },
  { id: 305, title: 'AMD Ryzen 5 7600X', subtitle: 'Great entry to AM5', category: 'CPUs', isNew: false, features: { Cores: '6C/12T', Boost: '5.3 GHz' },
    specifications: { Cores: '6', Threads: '12', 'Base Clock': '4.7 GHz', 'Boost Clock': '5.3 GHz', 'L3 Cache': '32MB', TDP: '105W' },
    scores: { Gaming: 88, Productivity: 78, Value: 94, Efficiency: 90 },
    prices: { amazon: { price: '$220', link: getURL('amazon', 'AMD Ryzen 5 7600X') }, flipkart: { price: '₹21,000', link: getURL('flipkart', 'AMD Ryzen 5 7600X') }, official: { price: '$299', link: getURL('official', 'AMD Ryzen 5 7600X') } }
  },
  { id: 306, title: 'Intel Core i7-14700K', subtitle: 'High-end all rounder', category: 'CPUs', isNew: true, features: { Cores: '20C/28T', Boost: '5.6 GHz' },
    specifications: { Cores: '20 (8P+12E)', Threads: '28', 'Base Clock': '3.4 GHz', 'Boost Clock': '5.6 GHz', 'L3 Cache': '33MB', TDP: '125W (253W Max)' },
    scores: { Gaming: 95, Productivity: 94, Value: 90, Efficiency: 75 },
    prices: { amazon: { price: '$390', link: getURL('amazon', 'Intel Core i7-14700K') }, flipkart: { price: '₹38,000', link: getURL('flipkart', 'Intel Core i7-14700K') }, official: { price: '$409', link: getURL('official', 'Intel Core i7-14700K') } }
  },
  { id: 307, title: 'AMD Ryzen 5 5600X', subtitle: 'Budget AM4 king', category: 'CPUs', isNew: false, features: { Cores: '6C/12T', Boost: '4.6 GHz' },
    specifications: { Cores: '6', Threads: '12', 'Base Clock': '3.7 GHz', 'Boost Clock': '4.6 GHz', 'L3 Cache': '32MB', TDP: '65W' },
    scores: { Gaming: 80, Productivity: 70, Value: 98, Efficiency: 96 },
    prices: { amazon: { price: '$135', link: getURL('amazon', 'AMD Ryzen 5 5600X') }, flipkart: { price: '₹14,500', link: getURL('flipkart', 'AMD Ryzen 5 5600X') }, official: { price: '$299', link: getURL('official', 'AMD Ryzen 5 5600X') } }
  },

  // Tools
  { id: 401, title: 'CrystalDiskMark', subtitle: 'Storage benchmark utility', category: 'TOOLS', isNew: false, features: { Type: 'Benchmarking', License: 'Open Source' },
    specifications: { Type: 'Benchmarking', Platform: 'Windows', Engine: 'Microsoft DiskSpd', Support: 'NVMe, SATA, USB', License: 'Open Source (MIT)' },
    scores: { Accuracy: 98, Speed: 95, EaseOfUse: 92 },
    prices: { amazon: { price: 'Free', link: 'https://crystalmark.info/en/' }, flipkart: { price: 'Free', link: 'https://crystalmark.info/en/' }, official: { price: 'Free', link: 'https://crystalmark.info/en/' } }
  },
  { id: 402, title: 'WizTree', subtitle: 'Extremely fast disk space analyzer', category: 'TOOLS', isNew: false, features: { Type: 'Analytics', Speed: 'MFT based' },
    specifications: { Type: 'Analytics', Platform: 'Windows', Technology: 'Direct MFT Parsing', Export: 'CSV/HTML', License: 'Free for Personal' },
    scores: { Accuracy: 99, Speed: 100, EaseOfUse: 95 },
    prices: { amazon: { price: 'Free', link: 'https://diskanalyzer.com/' }, flipkart: { price: 'Free', link: 'https://diskanalyzer.com/' }, official: { price: 'Free', link: 'https://diskanalyzer.com/' } }
  },
  { id: 403, title: 'Samsung Magician', subtitle: 'SSD management software', category: 'TOOLS', isNew: false, features: { Ecosystem: 'Samsung', Type: 'Optimization' },
    specifications: { Type: 'Optimization', Platform: 'Windows/Mac', Target: 'Samsung SSDs', Features: 'Firmware Update, Secure Erase, Overprovisioning', License: 'Proprietary Freeware' },
    scores: { Accuracy: 94, Speed: 90, EaseOfUse: 98 },
    prices: { amazon: { price: 'Free', link: 'https://semiconductor.samsung.com/consumer-storage/magician/' }, flipkart: { price: 'Free', link: 'https://semiconductor.samsung.com/consumer-storage/magician/' }, official: { price: 'Free', link: 'https://semiconductor.samsung.com/consumer-storage/magician/' } }
  },
  { id: 404, title: 'Apple Intelligence', subtitle: 'Advanced AI features for Apple ecosystem', category: 'TOOLS', isNew: true, features: { Ecosystem: 'Apple', Type: 'Generative AI' },
    specifications: { Type: 'Generative AI', Platform: 'iOS/macOS', Models: 'On-device + Private Cloud', Integration: 'System-wide', Requirements: 'A17 Pro or M1+' },
    scores: { Utility: 92, Innovation: 95, Privacy: 98 },
    prices: { amazon: { price: 'Included', link: 'https://apple.com' }, flipkart: { price: 'Included', link: 'https://apple.com' }, official: { price: 'Included with Devices', link: 'https://www.apple.com/apple-intelligence/' } }
  },
  { id: 405, title: 'Galaxy AI', subtitle: "Samsung's integrated mobile AI", category: 'TOOLS', isNew: true, features: { Ecosystem: 'Android/Samsung', Type: 'Generative AI' },
    specifications: { Type: 'Generative AI', Platform: 'Android (OneUI)', Models: 'Google Gemini Pro / Nano', Features: 'Live Translate, Circle to Search', Devices: 'S23/S24 series' },
    scores: { Utility: 95, Innovation: 90, Integration: 94 },
    prices: { amazon: { price: 'Included', link: 'https://samsung.com' }, flipkart: { price: 'Included', link: 'https://samsung.com' }, official: { price: 'Free until 2025', link: 'https://www.samsung.com/global/galaxy/galaxy-ai/' } }
  },
  { id: 406, title: 'HWMonitor', subtitle: 'Hardware sensor monitoring tool', category: 'TOOLS', isNew: false, features: { Type: 'Diagnostics', Sensors: 'Temps, Voltages, Fans' },
    specifications: { Type: 'Diagnostics', Platform: 'Windows', Sensors: 'Thermal, Voltage, Fan Speed, Power', Export: 'TXT Logs', License: 'Freemium' },
    scores: { Accuracy: 90, Detail: 94, EaseOfUse: 85 },
    prices: { amazon: { price: 'Free', link: 'https://cpuid.com' }, flipkart: { price: 'Free', link: 'https://cpuid.com' }, official: { price: 'Free / €20 Pro', link: 'https://www.cpuid.com/softwares/hwmonitor.html' } }
  },
  { id: 407, title: 'Cinebench R24', subtitle: 'CPU/GPU rendering benchmark', category: 'TOOLS', isNew: false, features: { Engine: 'Redshift', Focus: 'Stress Testing' },
    specifications: { Type: 'Benchmarking', Platform: 'Windows/Mac', Engine: 'Redshift 3D', Support: 'x86, ARM, GPUs', License: 'Free' },
    scores: { Accuracy: 98, Detail: 92, EaseOfUse: 96 },
    prices: { amazon: { price: 'Free', link: 'https://maxon.net' }, flipkart: { price: 'Free', link: 'https://maxon.net' }, official: { price: 'Free', link: 'https://www.maxon.net/en/cinebench' } }
  },
  { id: 408, title: 'Rufus', subtitle: 'Create bootable USB drives', category: 'TOOLS', isNew: false, features: { Type: 'System Utility', SupportedOS: 'Windows/Linux' },
    specifications: { Type: 'Utility', Platform: 'Windows', Output: 'Bootable USBs (ISO/DD)', Speed: 'Extremely Fast', Bypass: 'Windows 11 TPM checks' },
    scores: { Utility: 99, Reliability: 100, EaseOfUse: 98 },
    prices: { amazon: { price: 'Free', link: 'https://rufus.ie' }, flipkart: { price: 'Free', link: 'https://rufus.ie' }, official: { price: 'Free (GPL)', link: 'https://rufus.ie/en/' } }
  },

    { id: 409, title: 'Git', subtitle: 'Distributed version control system', category: 'TOOLS', isNew: false, features: { Type: 'VCS', License: 'GPL-2.0' },
    specifications: { Type: 'Version Control', Platform: 'Cross-platform', Language: 'C', Support: 'Git', License: 'Open Source (GPL-2.0)', Description: 'The most widely used modern version control system in the world.', PrimaryUseCase: 'Source code management, non-linear workflows.', Ecosystem: 'GitHub, GitLab, Bitbucket' },
    scores: { Reliability: 100, Speed: 98, EaseOfUse: 85 },
    prices: { amazon: { price: 'Free', link: 'https://git-scm.com/' }, flipkart: { price: 'Free', link: 'https://git-scm.com/' }, official: { price: 'Free', link: 'https://git-scm.com/' } }
  },
  { id: 410, title: 'Apache Subversion (SVN)', subtitle: 'Centralized version control', category: 'TOOLS', isNew: false, features: { Type: 'VCS', License: 'Apache-2.0' },
    specifications: { Type: 'Version Control', Platform: 'Cross-platform', Language: 'C', Support: 'SVN', License: 'Open Source (Apache-2.0)', Description: 'Centralized revision control system meant to be a better CVS.', PrimaryUseCase: 'Legacy enterprise version control, large binary files.', Ecosystem: 'TortoiseSVN' },
    scores: { Reliability: 95, Speed: 80, EaseOfUse: 90 },
    prices: { amazon: { price: 'Free', link: 'https://subversion.apache.org/' }, flipkart: { price: 'Free', link: 'https://subversion.apache.org/' }, official: { price: 'Free', link: 'https://subversion.apache.org/' } }
  },
  { id: 411, title: 'Mercurial', subtitle: 'Distributed version control', category: 'TOOLS', isNew: false, features: { Type: 'VCS', License: 'GPL-2.0' },
    specifications: { Type: 'Version Control', Platform: 'Cross-platform', Language: 'Python', Support: 'Mercurial', License: 'Open Source (GPL-2.0)', Description: 'Free, distributed source control management tool known for its performance and scale.', PrimaryUseCase: 'Handling large projects elegantly.', Ecosystem: 'RhodeCode, Phabricator' },
    scores: { Reliability: 98, Speed: 90, EaseOfUse: 92 },
    prices: { amazon: { price: 'Free', link: 'https://www.mercurial-scm.org/' }, flipkart: { price: 'Free', link: 'https://www.mercurial-scm.org/' }, official: { price: 'Free', link: 'https://www.mercurial-scm.org/' } }
  },
  { id: 412, title: 'VSCodium', subtitle: 'Telemetry-free VS Code binary', category: 'TOOLS', isNew: false, features: { Type: 'IDE', License: 'MIT' },
    specifications: { Type: 'Code Editor', Platform: 'Cross-platform', Engine: 'Electron', Support: 'Multiple', License: 'Open Source (MIT)', Description: 'Community-driven, freely-licensed binary distribution of Microsoft VS Code without telemetry.', PrimaryUseCase: 'General purpose code editing.', Ecosystem: 'OpenVSX Registry' },
    scores: { Extensibility: 98, Performance: 90, Privacy: 100 },
    prices: { amazon: { price: 'Free', link: 'https://vscodium.com/' }, flipkart: { price: 'Free', link: 'https://vscodium.com/' }, official: { price: 'Free', link: 'https://vscodium.com/' } }
  },
  { id: 413, title: 'Eclipse IDE', subtitle: 'Extensible development platform', category: 'TOOLS', isNew: false, features: { Type: 'IDE', License: 'EPL-2.0' },
    specifications: { Type: 'IDE', Platform: 'Cross-platform', Language: 'Java', Support: 'Multiple', License: 'Open Source (EPL-2.0)', Description: 'Famous for Java IDE, but C/C++ and PHP IDEs are also heavily used.', PrimaryUseCase: 'Enterprise Java development.', Ecosystem: 'Eclipse Marketplace' },
    scores: { Extensibility: 95, Performance: 80, Maturity: 99 },
    prices: { amazon: { price: 'Free', link: 'https://www.eclipse.org/' }, flipkart: { price: 'Free', link: 'https://www.eclipse.org/' }, official: { price: 'Free', link: 'https://www.eclipse.org/' } }
  },
  { id: 414, title: 'IntelliJ IDEA Community', subtitle: 'Capable Java IDE', category: 'TOOLS', isNew: false, features: { Type: 'IDE', License: 'Apache-2.0' },
    specifications: { Type: 'IDE', Platform: 'Cross-platform', Language: 'Java', Support: 'Java, Kotlin', License: 'Open Source (Apache-2.0)', Description: 'The smartest JVM IDE by JetBrains, community edition.', PrimaryUseCase: 'JVM-based application development.', Ecosystem: 'JetBrains Marketplace' },
    scores: { Features: 96, Performance: 88, EaseOfUse: 92 },
    prices: { amazon: { price: 'Free', link: 'https://www.jetbrains.com/idea/' }, flipkart: { price: 'Free', link: 'https://www.jetbrains.com/idea/' }, official: { price: 'Free', link: 'https://www.jetbrains.com/idea/' } }
  },
  { id: 415, title: 'Apache Maven', subtitle: 'Software comprehension tool', category: 'TOOLS', isNew: false, features: { Type: 'Build Tool', License: 'Apache-2.0' },
    specifications: { Type: 'Build Tool', Platform: 'Cross-platform', Language: 'Java', Support: 'POM based', License: 'Open Source (Apache-2.0)', Description: 'Declarative build automation primarily used for Java projects.', PrimaryUseCase: 'Dependency management and standardized builds.', Ecosystem: 'Maven Central Repository' },
    scores: { Reliability: 99, Features: 90, Ecosystem: 98 },
    prices: { amazon: { price: 'Free', link: 'https://maven.apache.org/' }, flipkart: { price: 'Free', link: 'https://maven.apache.org/' }, official: { price: 'Free', link: 'https://maven.apache.org/' } }
  },
  { id: 416, title: 'Gradle', subtitle: 'Accelerates developer productivity', category: 'TOOLS', isNew: false, features: { Type: 'Build Tool', License: 'Apache-2.0' },
    specifications: { Type: 'Build Tool', Platform: 'Cross-platform', Language: 'Java/Kotlin', Support: 'DSL', License: 'Open Source (Apache-2.0)', Description: 'Highly customizable and fast build automation tool.', PrimaryUseCase: 'Android development and multi-project Java builds.', Ecosystem: 'Gradle Plugins' },
    scores: { Performance: 95, Flexibility: 98, Ecosystem: 92 },
    prices: { amazon: { price: 'Free', link: 'https://gradle.org/' }, flipkart: { price: 'Free', link: 'https://gradle.org/' }, official: { price: 'Free', link: 'https://gradle.org/' } }
  },
  { id: 417, title: 'Apache Ant', subtitle: 'Java based build tool', category: 'TOOLS', isNew: false, features: { Type: 'Build Tool', License: 'Apache-2.0' },
    specifications: { Type: 'Build Tool', Platform: 'Cross-platform', Language: 'Java', Support: 'XML based', License: 'Open Source (Apache-2.0)', Description: 'Extremely flexible, procedural build system using XML.', PrimaryUseCase: 'Custom build scripts and legacy Java support.', Ecosystem: 'Apache Foundation' },
    scores: { Dependability: 99, Speed: 90, Flexibility: 85 },
    prices: { amazon: { price: 'Free', link: 'https://ant.apache.org/' }, flipkart: { price: 'Free', link: 'https://ant.apache.org/' }, official: { price: 'Free', link: 'https://ant.apache.org/' } }
  },
  { id: 418, title: 'Jenkins', subtitle: 'Leading open source automation server', category: 'TOOLS', isNew: false, features: { Type: 'CI/CD', License: 'MIT' },
    specifications: { Type: 'CI/CD Server', Platform: 'Cross-platform', Language: 'Java', Plugins: '1800+', License: 'Open Source (MIT)', Description: 'Provides hundreds of plugins to support building, deploying and automating any project.', PrimaryUseCase: 'Continuous Integration / Continuous Delivery pipelines.', Ecosystem: 'Jenkins Plugin Index' },
    scores: { Extensibility: 100, Ecosystem: 99, EaseOfSetup: 80 },
    prices: { amazon: { price: 'Free', link: 'https://www.jenkins.io/' }, flipkart: { price: 'Free', link: 'https://www.jenkins.io/' }, official: { price: 'Free', link: 'https://www.jenkins.io/' } }
  },
  { id: 419, title: 'GitLab CI/CD', subtitle: 'Integrated CI/CD platform', category: 'TOOLS', isNew: false, features: { Type: 'CI/CD', License: 'MIT' },
    specifications: { Type: 'CI/CD', Platform: 'Cross-platform', Integrated: 'GitLab', Runners: 'Go based', License: 'Open Source (MIT)', Description: 'Built into GitLab to automatically build, test, secure, and deploy software.', PrimaryUseCase: 'Seamless code-to-deployment workflows.', Ecosystem: 'GitLab Registry' },
    scores: { Integration: 99, Features: 95, EaseOfUse: 92 },
    prices: { amazon: { price: 'Free', link: 'https://about.gitlab.com/' }, flipkart: { price: 'Free', link: 'https://about.gitlab.com/' }, official: { price: 'Free', link: 'https://docs.gitlab.com/ee/ci/' } }
  },
  { id: 420, title: 'Tekton', subtitle: 'Cloud-native CI/CD framework', category: 'TOOLS', isNew: false, features: { Type: 'CI/CD', License: 'Apache-2.0' },
    specifications: { Type: 'CI/CD', Platform: 'Kubernetes', Language: 'Go', Ecosystem: 'CD Foundation', License: 'Open Source (Apache-2.0)', Description: 'Kubernetes-native framework for creating continuous integration and delivery systems.', PrimaryUseCase: 'Serverless CI/CD on Kubernetes.', Ecosystem: 'Tekton Hub' },
    scores: { Flexibility: 95, Scalability: 98, Ecosystem: 88 },
    prices: { amazon: { price: 'Free', link: 'https://tekton.dev/' }, flipkart: { price: 'Free', link: 'https://tekton.dev/' }, official: { price: 'Free', link: 'https://tekton.dev/' } }
  },
  { id: 421, title: 'Docker Engine', subtitle: 'Industry standard container runtime', category: 'TOOLS', isNew: false, features: { Type: 'Containerization', License: 'Apache-2.0' },
    specifications: { Type: 'Container Runtime', Platform: 'Linux/Mac/Win', Core: 'containerd', Interface: 'CLI', License: 'Open Source (Apache-2.0)', Description: 'De-facto standard for building, sharing, and running applications in isolated containers.', PrimaryUseCase: 'Local development and microservices packaging.', Ecosystem: 'Docker Hub' },
    scores: { Ecosystem: 100, Usability: 95, Reliability: 99 },
    prices: { amazon: { price: 'Free', link: 'https://www.docker.com/' }, flipkart: { price: 'Free', link: 'https://www.docker.com/' }, official: { price: 'Free', link: 'https://github.com/docker/engine' } }
  },
  { id: 422, title: 'Podman', subtitle: 'Daemonless container engine', category: 'TOOLS', isNew: true, features: { Type: 'Containerization', License: 'Apache-2.0' },
    specifications: { Type: 'Container Runtime', Platform: 'Linux/Mac/Win', Architecture: 'Daemonless', Rootless: 'Yes', License: 'Open Source (Apache-2.0)', Description: 'A secure alternative to Docker that does not require a root daemon.', PrimaryUseCase: 'Rootless container isolation for improved security.', Ecosystem: 'RedHat / OCI' },
    scores: { Security: 98, Compatibility: 96, Architecture: 95 },
    prices: { amazon: { price: 'Free', link: 'https://podman.io/' }, flipkart: { price: 'Free', link: 'https://podman.io/' }, official: { price: 'Free', link: 'https://podman.io/' } }
  },
  { id: 423, title: 'containerd', subtitle: 'Standard container runtime', category: 'TOOLS', isNew: false, features: { Type: 'Containerization', License: 'Apache-2.0' },
    specifications: { Type: 'Container Runtime', Platform: 'Linux/Win', Ecosystem: 'CNCF', Focus: 'Simplicity', License: 'Open Source (Apache-2.0)', Description: 'Industry-standard core container runtime with an emphasis on simplicity, robustness and portability.', PrimaryUseCase: 'Base runtime used by Kubernetes and Docker.', Ecosystem: 'CNCF' },
    scores: { Performance: 99, Reliability: 99, Ecosystem: 96 },
    prices: { amazon: { price: 'Free', link: 'https://containerd.io/' }, flipkart: { price: 'Free', link: 'https://containerd.io/' }, official: { price: 'Free', link: 'https://containerd.io/' } }
  },
  { id: 424, title: 'Kubernetes', subtitle: 'Container orchestration system', category: 'TOOLS', isNew: false, features: { Type: 'Orchestration', License: 'Apache-2.0' },
    specifications: { Type: 'Orchestration', Platform: 'Linux', Ecosystem: 'CNCF', Scaling: 'Automated', License: 'Open Source (Apache-2.0)', Description: 'Automates deployment, scaling, and management of containerized applications.', PrimaryUseCase: 'Enterprise and cloud-scale container orchestration.', Ecosystem: 'Helm, Cloud Native' },
    scores: { Scalability: 100, Ecosystem: 100, Complexity: 85 },
    prices: { amazon: { price: 'Free', link: 'https://kubernetes.io/' }, flipkart: { price: 'Free', link: 'https://kubernetes.io/' }, official: { price: 'Free', link: 'https://kubernetes.io/' } }
  },
  { id: 425, title: 'Docker Swarm', subtitle: 'Native clustering for Docker', category: 'TOOLS', isNew: false, features: { Type: 'Orchestration', License: 'Apache-2.0' },
    specifications: { Type: 'Orchestration', Platform: 'Cross-platform', Integration: 'Docker CLI', Setup: 'Simple', License: 'Open Source (Apache-2.0)', Description: 'Swarm mode is built into the Docker Engine and is extremely easy to set up.', PrimaryUseCase: 'Simple container orchestration for small/medium clusters.', Ecosystem: 'Docker Engine' },
    scores: { Usability: 96, Simplicity: 98, Scalability: 88 },
    prices: { amazon: { price: 'Free', link: 'https://docs.docker.com/engine/swarm/' }, flipkart: { price: 'Free', link: 'https://docs.docker.com/engine/swarm/' }, official: { price: 'Free', link: 'https://docs.docker.com/engine/swarm/' } }
  },
  { id: 426, title: 'Nomad', subtitle: 'Simple/flexible workload orchestrator', category: 'TOOLS', isNew: false, features: { Type: 'Orchestration', License: 'BUSL/MPL' },
    specifications: { Type: 'Orchestration', Platform: 'Cross-platform', Vendor: 'HashiCorp', Workloads: 'Containers, VMs, Binaries', License: 'Open Source/BUSL', Description: 'Orchestrates any type of application, not just containers.', PrimaryUseCase: 'Mixed workloads (VMs + Containers + Edge) orchestration.', Ecosystem: 'Consul, Vault' },
    scores: { Flexibility: 97, Simplicity: 94, Performance: 95 },
    prices: { amazon: { price: 'Free', link: 'https://www.nomadproject.io/' }, flipkart: { price: 'Free', link: 'https://www.nomadproject.io/' }, official: { price: 'Free', link: 'https://www.nomadproject.io/' } }
  },
  { id: 427, title: 'Ansible', subtitle: 'Simple IT automation', category: 'TOOLS', isNew: false, features: { Type: 'Config Mgmt', License: 'GPL-3.0' },
    specifications: { Type: 'Automation', Platform: 'Cross-platform', Language: 'Python/YAML', Architecture: 'Agentless', License: 'Open Source (GPL-3.0)', Description: 'Radically simple IT automation engine via SSH without agents.', PrimaryUseCase: 'Configuration management and ad-hoc infrastructure logic.', Ecosystem: 'Ansible Galaxy' },
    scores: { Usability: 98, Adoption: 99, Extensibility: 96 },
    prices: { amazon: { price: 'Free', link: 'https://www.ansible.com/' }, flipkart: { price: 'Free', link: 'https://www.ansible.com/' }, official: { price: 'Free', link: 'https://www.ansible.com/' } }
  },
  { id: 428, title: 'Puppet', subtitle: 'Infrastructure delivery tooling', category: 'TOOLS', isNew: false, features: { Type: 'Config Mgmt', License: 'Apache-2.0' },
    specifications: { Type: 'Automation', Platform: 'Cross-platform', Language: 'Ruby/DSL', Architecture: 'Agent-based', License: 'Open Source (Apache-2.0)', Description: 'Ensures servers are configured in their desired state continuously.', PrimaryUseCase: 'Large scale infrastructure-as-code management.', Ecosystem: 'Puppet Forge' },
    scores: { Scalability: 97, Reliability: 95, Usability: 85 },
    prices: { amazon: { price: 'Free', link: 'https://puppet.com/' }, flipkart: { price: 'Free', link: 'https://puppet.com/' }, official: { price: 'Free', link: 'https://puppet.com/' } }
  },
  { id: 429, title: 'Chef', subtitle: 'Infrastructure as code', category: 'TOOLS', isNew: false, features: { Type: 'Config Mgmt', License: 'Apache-2.0' },
    specifications: { Type: 'Automation', Platform: 'Cross-platform', Language: 'Ruby', Architecture: 'Agent-based', License: 'Open Source (Apache-2.0)', Description: 'Transform infrastructure into code using Ruby dialects.', PrimaryUseCase: 'Extremely customizable configuration enforcement.', Ecosystem: 'Chef Supermarket' },
    scores: { Flexibility: 95, Extensibility: 96, Usability: 82 },
    prices: { amazon: { price: 'Free', link: 'https://www.chef.io/' }, flipkart: { price: 'Free', link: 'https://www.chef.io/' }, official: { price: 'Free', link: 'https://www.chef.io/' } }
  },
  { id: 430, title: 'Redmine', subtitle: 'Flexible project management web app', category: 'TOOLS', isNew: false, features: { Type: 'Project Mgmt', License: 'GPL-2.0' },
    specifications: { Type: 'Issue Tracker', Platform: 'Web', Language: 'Ruby on Rails', Plugins: 'Extensive', License: 'Open Source (GPL-2.0)', Description: 'Provides Gantt charts, calendar, wiki, forums, and role-based access.', PrimaryUseCase: 'Cross-project issue tracking and traditional management.', Ecosystem: 'Redmine Plugins' },
    scores: { Features: 94, Flexibility: 95, ModernUI: 70 },
    prices: { amazon: { price: 'Free', link: 'https://www.redmine.org/' }, flipkart: { price: 'Free', link: 'https://www.redmine.org/' }, official: { price: 'Free', link: 'https://www.redmine.org/' } }
  },
  { id: 431, title: 'Bugzilla', subtitle: 'Robust defect tracking system', category: 'TOOLS', isNew: false, features: { Type: 'Project Mgmt', License: 'MPL' },
    specifications: { Type: 'Issue Tracker', Platform: 'Web', Language: 'Perl', UseCase: 'Large Projects', License: 'Open Source (MPL)', Description: 'Used by organizations like Mozilla to track highly complex software defects.', PrimaryUseCase: 'Heavy-duty software bug tracking.', Ecosystem: 'Bugzilla Extensions' },
    scores: { Capability: 98, Speed: 90, ModernUI: 60 },
    prices: { amazon: { price: 'Free', link: 'https://www.bugzilla.org/' }, flipkart: { price: 'Free', link: 'https://www.bugzilla.org/' }, official: { price: 'Free', link: 'https://www.bugzilla.org/' } }
  },
  { id: 432, title: 'Taiga', subtitle: 'Agile project management platform', category: 'TOOLS', isNew: false, features: { Type: 'Project Mgmt', License: 'AGPL-3.0' },
    specifications: { Type: 'Issue Tracker', Platform: 'Web', Language: 'Python/Django', Framework: 'Scrum/Kanban', License: 'Open Source (AGPL-3.0)', Description: 'Highly visual platform tailored strictly for agile methodologies.', PrimaryUseCase: 'Scrum sprints and Kanban boards for dev teams.', Ecosystem: 'Taiga Integrations' },
    scores: { Usability: 96, Aesthetics: 95, Features: 90 },
    prices: { amazon: { price: 'Free', link: 'https://taiga.io/' }, flipkart: { price: 'Free', link: 'https://taiga.io/' }, official: { price: 'Free', link: 'https://taiga.io/' } }
  },
  { id: 433, title: 'SonarQube (Community)', subtitle: 'Code quality and security', category: 'TOOLS', isNew: false, features: { Type: 'Code Quality', License: 'LGPL-3.0' },
    specifications: { Type: 'Static Analysis', Platform: 'Web', Support: '15+ Languages', UseCase: 'CI/CD Integration', License: 'Open Source (LGPL-3.0)', Description: 'Continuously inspects code quality to detect bugs, code smells and security vulnerabilities.', PrimaryUseCase: 'Automated CI code review.', Ecosystem: 'SonarSource' },
    scores: { Analysis: 98, Ecosystem: 96, Usability: 92 },
    prices: { amazon: { price: 'Free', link: 'https://www.sonarsource.com/products/sonarqube/' }, flipkart: { price: 'Free', link: 'https://www.sonarsource.com/products/sonarqube/' }, official: { price: 'Free', link: 'https://www.sonarqube.org/' } }
  },
  { id: 434, title: 'ESLint', subtitle: 'Pluggable JavaScript linter', category: 'TOOLS', isNew: false, features: { Type: 'Code Quality', License: 'MIT' },
    specifications: { Type: 'Linter', Platform: 'Node.js', Language: 'JS/TS', Customization: 'High', License: 'Open Source (MIT)', Description: 'Find and fix problems in your JavaScript code.', PrimaryUseCase: 'Enforcing JS/TS code standards and catching syntax bugs.', Ecosystem: 'NPM rulesets' },
    scores: { Usability: 99, Ecosystem: 100, Speed: 95 },
    prices: { amazon: { price: 'Free', link: 'https://eslint.org/' }, flipkart: { price: 'Free', link: 'https://eslint.org/' }, official: { price: 'Free', link: 'https://eslint.org/' } }
  },
  { id: 435, title: 'Prettier', subtitle: 'Opinionated code formatter', category: 'TOOLS', isNew: false, features: { Type: 'Code Quality', License: 'MIT' },
    specifications: { Type: 'Formatter', Platform: 'Node.js', Language: 'Multiple', Ecosystem: 'IDE Plug-ins', License: 'Open Source (MIT)', Description: 'Parses code and re-prints it with its own consistent style.', PrimaryUseCase: 'Automatic code style homogenization over a repository.', Ecosystem: 'Prettier Plugins' },
    scores: { Speed: 98, Consistency: 100, Adoption: 99 },
    prices: { amazon: { price: 'Free', link: 'https://prettier.io/' }, flipkart: { price: 'Free', link: 'https://prettier.io/' }, official: { price: 'Free', link: 'https://prettier.io/' } }
  },
  { id: 436, title: 'Selenium', subtitle: 'Browser automation framework', category: 'TOOLS', isNew: false, features: { Type: 'Testing', License: 'Apache-2.0' },
    specifications: { Type: 'Testing Web', Platform: 'Cross-platform', Language: 'Multiple', Support: 'All major browsers', License: 'Open Source (Apache-2.0)', Description: 'Provides a playback tool for authoring tests without the need to learn a test scripting language.', PrimaryUseCase: 'Automated end-to-end web testing across all browsers.', Ecosystem: 'Selenium Grid' },
    scores: { Capability: 99, Ecosystem: 100, Speed: 80 },
    prices: { amazon: { price: 'Free', link: 'https://www.selenium.dev/' }, flipkart: { price: 'Free', link: 'https://www.selenium.dev/' }, official: { price: 'Free', link: 'https://www.selenium.dev/' } }
  },
  { id: 437, title: 'Cypress', subtitle: 'Next generation front end testing tool', category: 'TOOLS', isNew: false, features: { Type: 'Testing', License: 'MIT' },
    specifications: { Type: 'Testing Web', Platform: 'Cross-platform', Language: 'JavaScript', Focus: 'E2E Testing', License: 'Open Source (MIT)', Description: 'Modern web automation built for the modern web directly in the browser architecture.', PrimaryUseCase: 'Developer-oriented E2E and component testing.', Ecosystem: 'Cypress Dashboard' },
    scores: { Usability: 98, Speed: 95, Features: 94 },
    prices: { amazon: { price: 'Free', link: 'https://www.cypress.io/' }, flipkart: { price: 'Free', link: 'https://www.cypress.io/' }, official: { price: 'Free', link: 'https://www.cypress.io/' } }
  },
  { id: 438, title: 'JUnit', subtitle: 'Testing framework for Java', category: 'TOOLS', isNew: false, features: { Type: 'Testing', License: 'EPL-2.0' },
    specifications: { Type: 'Unit Testing', Platform: 'Java', Architecture: 'JUnit 5 Platform', UseCase: 'TDD', License: 'Open Source (EPL-2.0)', Description: 'The most popular unit testing framework providing annotations for test execution.', PrimaryUseCase: 'Test-Driven Development (TDD) for Java applications.', Ecosystem: 'Maven/Gradle Test' },
    scores: { Ecosystem: 100, Stability: 99, Extensibility: 95 },
    prices: { amazon: { price: 'Free', link: 'https://junit.org/' }, flipkart: { price: 'Free', link: 'https://junit.org/' }, official: { price: 'Free', link: 'https://junit.org/' } }
  },
  { id: 439, title: 'PostgreSQL', subtitle: 'Advanced open source relational DB', category: 'TOOLS', isNew: false, features: { Type: 'Database', License: 'PostgreSQL' },
    specifications: { Type: 'RDBMS', Platform: 'Cross-platform', Language: 'C', ACID: 'Yes', License: 'Open Source (PostgreSQL License)', Description: 'Highly robust relational database system known for strict standards compliance and scalability.', PrimaryUseCase: 'Complex relational schemas and structured data integrity.', Ecosystem: 'PostGIS, Citus' },
    scores: { Reliability: 100, Features: 99, Performance: 95 },
    prices: { amazon: { price: 'Free', link: 'https://www.postgresql.org/' }, flipkart: { price: 'Free', link: 'https://www.postgresql.org/' }, official: { price: 'Free', link: 'https://www.postgresql.org/' } }
  },
  { id: 440, title: 'MySQL', subtitle: 'Most popular open source DB', category: 'TOOLS', isNew: false, features: { Type: 'Database', License: 'GPL-2.0' },
    specifications: { Type: 'RDBMS', Platform: 'Cross-platform', Language: 'C/C++', Performance: 'High', License: 'Open Source (GPL-2.0)', Description: 'Fast, reliable, and extremely popular database backend for web applications.', PrimaryUseCase: 'General purpose relational data serving.', Ecosystem: 'Oracle' },
    scores: { Scalability: 96, Adoption: 100, Usability: 92 },
    prices: { amazon: { price: 'Free', link: 'https://www.mysql.com/' }, flipkart: { price: 'Free', link: 'https://www.mysql.com/' }, official: { price: 'Free', link: 'https://www.mysql.com/' } }
  },
  { id: 441, title: 'MariaDB', subtitle: 'Community-developed fork of MySQL', category: 'TOOLS', isNew: false, features: { Type: 'Database', License: 'GPL-2.0' },
    specifications: { Type: 'RDBMS', Platform: 'Cross-platform', Language: 'C/C++', StorageEngines: 'Pluggable', License: 'Open Source (GPL-2.0)', Description: 'Created by original developers of MySQL with guarantees to stay open source.', PrimaryUseCase: 'Drop-in replacement for MySQL with more features.', Ecosystem: 'MariaDB Foundation' },
    scores: { Innovation: 95, Performance: 97, Compatibility: 98 },
    prices: { amazon: { price: 'Free', link: 'https://mariadb.org/' }, flipkart: { price: 'Free', link: 'https://mariadb.org/' }, official: { price: 'Free', link: 'https://mariadb.org/' } }
  },
  { id: 442, title: 'Hoppscotch', subtitle: 'Open source API development ecosystem', category: 'TOOLS', isNew: true, features: { Type: 'API Tool', License: 'MIT' },
    specifications: { Type: 'API Client', Platform: 'Web/PWA', Architecture: 'Vue.js', Identity: 'Postman Alternative', License: 'Open Source (MIT)', Description: 'Lightweight web-based API request builder with real-time syncing.', PrimaryUseCase: 'Rapid API testing and sharing within the browser.', Ecosystem: 'Hoppscotch CLI' },
    scores: { Usability: 98, Speed: 99, Features: 92 },
    prices: { amazon: { price: 'Free', link: 'https://hoppscotch.io/' }, flipkart: { price: 'Free', link: 'https://hoppscotch.io/' }, official: { price: 'Free', link: 'https://hoppscotch.io/' } }
  },
  { id: 443, title: 'Insomnia', subtitle: 'API platform for GraphQL/REST/gRPC', category: 'TOOLS', isNew: false, features: { Type: 'API Tool', License: 'MIT' },
    specifications: { Type: 'API Client', Platform: 'Cross-platform', Support: 'GraphQL, REST', Extensibility: 'Plugins', License: 'Open Source (MIT)', Description: 'Desktop application to test APIs locally and efficiently with strong GraphQL support.', PrimaryUseCase: 'REST/GraphQL API design and testing.', Ecosystem: 'Insomnia Plugins' },
    scores: { Aesthetics: 96, Features: 95, Adoption: 90 },
    prices: { amazon: { price: 'Free', link: 'https://insomnia.rest/' }, flipkart: { price: 'Free', link: 'https://insomnia.rest/' }, official: { price: 'Free', link: 'https://insomnia.rest/' } }
  },
  { id: 444, title: 'Bruno', subtitle: 'Open-source IDE for exploring APIs', category: 'TOOLS', isNew: true, features: { Type: 'API Tool', License: 'MIT' },
    specifications: { Type: 'API Client', Platform: 'Cross-platform', Storage: 'Local Plain Text', Identity: 'Postman Alternative', License: 'Open Source (MIT)', Description: 'Revolutionary API client that stores collections as plain text making it Git-friendly.', PrimaryUseCase: 'Version-controlled API collections without cloud dependency.', Ecosystem: 'Bruno CLI' },
    scores: { Privacy: 100, Usability: 94, Speed: 96 },
    prices: { amazon: { price: 'Free', link: 'https://www.usebruno.com/' }, flipkart: { price: 'Free', link: 'https://www.usebruno.com/' }, official: { price: 'Free', link: 'https://www.usebruno.com/' } }
  },
  { id: 445, title: 'Prometheus', subtitle: 'Monitoring system & time series DB', category: 'TOOLS', isNew: false, features: { Type: 'Monitoring', License: 'Apache-2.0' },
    specifications: { Type: 'Monitoring', Platform: 'Linux', Ecosystem: 'CNCF', QueryLanguage: 'PromQL', License: 'Open Source (Apache-2.0)', Description: 'Gathers multi-dimensional time series data using a pull model.', PrimaryUseCase: 'Cloud-native service monitoring and alerting.', Ecosystem: 'Exporters / Grafana' },
    scores: { Scalability: 98, Features: 99, EaseOfSetup: 85 },
    prices: { amazon: { price: 'Free', link: 'https://prometheus.io/' }, flipkart: { price: 'Free', link: 'https://prometheus.io/' }, official: { price: 'Free', link: 'https://prometheus.io/' } }
  },
  { id: 446, title: 'Grafana', subtitle: 'The open observability platform', category: 'TOOLS', isNew: false, features: { Type: 'Monitoring', License: 'AGPL-3.0' },
    specifications: { Type: 'Dashboarding', Platform: 'Cross-platform', Integration: 'Prometheus, TSDBs', Visuals: 'Extensive', License: 'Open Source (AGPL-3.0)', Description: 'Allows you to query, visualize, alert on and understand your metrics no matter where they are stored.', PrimaryUseCase: 'Interactive dashboards for metrics and logs.', Ecosystem: 'Grafana Plugins' },
    scores: { Visualization: 100, Usability: 96, Ecosystem: 99 },
    prices: { amazon: { price: 'Free', link: 'https://grafana.com/' }, flipkart: { price: 'Free', link: 'https://grafana.com/' }, official: { price: 'Free', link: 'https://grafana.com/' } }
  },
  { id: 447, title: 'Zabbix', subtitle: 'Enterprise-class monitoring solution', category: 'TOOLS', isNew: false, features: { Type: 'Monitoring', License: 'GPL-2.0' },
    specifications: { Type: 'Monitoring', Platform: 'Cross-platform', Scalability: 'Enterprise', Agents: 'Available', License: 'Open Source (GPL-2.0)', Description: 'Mature, network-heavy monitoring system with built-in UI and alerting.', PrimaryUseCase: 'Server and network infrastructure monitoring.', Ecosystem: 'Zabbix Integrations' },
    scores: { Capability: 97, Scalability: 96, ModernUI: 80 },
    prices: { amazon: { price: 'Free', link: 'https://www.zabbix.com/' }, flipkart: { price: 'Free', link: 'https://www.zabbix.com/' }, official: { price: 'Free', link: 'https://www.zabbix.com/' } }
  },
  { id: 448, title: 'Elasticsearch', subtitle: 'Distributed, RESTful search/analytics engine', category: 'TOOLS', isNew: false, features: { Type: 'Log Mgmt', License: 'Elastic/SSPL' },
    specifications: { Type: 'Search Engine', Platform: 'Cross-platform', Base: 'Apache Lucene', Ecosystem: 'ELK Stack', License: 'Open Source / Business', Description: 'Provides a distributed, multitenant-capable full-text search engine.', PrimaryUseCase: 'Log aggregation and extremely fast unstructured searches.', Ecosystem: 'Kibana, Logstash' },
    scores: { Speed: 99, Scalability: 98, Features: 97 },
    prices: { amazon: { price: 'Free', link: 'https://www.elastic.co/' }, flipkart: { price: 'Free', link: 'https://www.elastic.co/' }, official: { price: 'Free', link: 'https://www.elastic.co/' } }
  },
  { id: 449, title: 'Logstash', subtitle: 'Server-side data processing pipeline', category: 'TOOLS', isNew: false, features: { Type: 'Log Mgmt', License: 'Elastic/SSPL' },
    specifications: { Type: 'Data Pipeline', Platform: 'Cross-platform', 'Input/Output': 'Versatile', Ecosystem: 'ELK Stack', License: 'Open Source / Business', Description: 'Ingests data from a multitude of sources simultaneously, transforms it, and sends it to your favorite stash.', PrimaryUseCase: 'Data parsing and routing for logging.', Ecosystem: 'Elastic Stack' },
    scores: { Capability: 96, Flexibility: 98, Performance: 88 },
    prices: { amazon: { price: 'Free', link: 'https://www.elastic.co/logstash' }, flipkart: { price: 'Free', link: 'https://www.elastic.co/logstash' }, official: { price: 'Free', link: 'https://www.elastic.co/logstash' } }
  },
  { id: 450, title: 'Fluentd', subtitle: 'Data collector for unified logging layer', category: 'TOOLS', isNew: false, features: { Type: 'Log Mgmt', License: 'Apache-2.0' },
    specifications: { Type: 'Data Pipeline', Platform: 'Cross-platform', Language: 'Ruby/C', Ecosystem: 'CNCF', License: 'Open Source (Apache-2.0)', Description: 'Decouples data sources from backend systems by providing a unified logging layer.', PrimaryUseCase: 'Cloud-native log collection and shipping.', Ecosystem: 'Fluent Bit, Kubernetes' },
    scores: { Reliability: 98, Adaptability: 97, ResourceUsage: 90 },
    prices: { amazon: { price: 'Free', link: 'https://www.fluentd.org/' }, flipkart: { price: 'Free', link: 'https://www.fluentd.org/' }, official: { price: 'Free', link: 'https://www.fluentd.org/' } }
  },
  { id: 451, title: 'Gitea', subtitle: 'Painless self-hosted Git service', category: 'TOOLS', isNew: false, features: { Type: 'Code Hosting', License: 'MIT' },
    specifications: { Type: 'Forge', Platform: 'Cross-platform', Language: 'Go', Focus: 'Lightweight', License: 'Open Source (MIT)', Description: 'Community managed, lightweight code hosting solution written in Go.', PrimaryUseCase: 'Self-hosting Git repositories on low-power servers.', Ecosystem: 'Forgejo' },
    scores: { Performance: 99, Simplicity: 96, Features: 88 },
    prices: { amazon: { price: 'Free', link: 'https://gitea.io/' }, flipkart: { price: 'Free', link: 'https://gitea.io/' }, official: { price: 'Free', link: 'https://gitea.io/' } }
  },
  { id: 452, title: 'GitLab CE', subtitle: 'Complete DevOps platform', category: 'TOOLS', isNew: false, features: { Type: 'Code Hosting', License: 'MIT' },
    specifications: { Type: 'Forge', Platform: 'Linux', Ecosystem: 'All-in-one', Scale: 'Enterprise', License: 'Open Source (MIT)', Description: 'A single application for the entire DevSecOps lifecycle.', PrimaryUseCase: 'Comprehensive enterprise-grade code repository and pipelines.', Ecosystem: 'GitLab Runners' },
    scores: { Features: 100, Scalability: 95, ResourceUsage: 75 },
    prices: { amazon: { price: 'Free', link: 'https://about.gitlab.com/' }, flipkart: { price: 'Free', link: 'https://about.gitlab.com/' }, official: { price: 'Free', link: 'https://about.gitlab.com/install/' } }
  },
  { id: 453, title: 'Nginx', subtitle: 'High performance web server & reverse proxy', category: 'TOOLS', isNew: false, features: { Type: 'Web Server', License: 'BSD-2-Clause' },
    specifications: { Type: 'Web Server', Platform: 'Cross-platform', Architecture: 'Event-driven', Capability: 'Load Balancer', License: 'Open Source (BSD-2-Clause)', Description: 'Known for its stability, rich feature set, simple configuration, and low resource consumption.', PrimaryUseCase: 'High-traffic reverse proxy serving static content.', Ecosystem: 'F5 Networks' },
    scores: { Performance: 100, Reliability: 99, Concurrency: 100 },
    prices: { amazon: { price: 'Free', link: 'https://nginx.org/' }, flipkart: { price: 'Free', link: 'https://nginx.org/' }, official: { price: 'Free', link: 'https://nginx.org/' } }
  },
  { id: 454, title: 'Apache HTTP Server', subtitle: 'Most popular web server', category: 'TOOLS', isNew: false, features: { Type: 'Web Server', License: 'Apache-2.0' },
    specifications: { Type: 'Web Server', Platform: 'Cross-platform', Architecture: 'Process/Thread based', Modules: 'Extensive', License: 'Open Source (Apache-2.0)', Description: 'A robust, commercial-grade, featureful HTTP server serving over 20% of internet traffic.', PrimaryUseCase: 'Dynamic content processing and highly configurable routing.', Ecosystem: 'Apache Foundation' },
    scores: { Features: 98, Ecosystem: 100, Configurable: 96 },
    prices: { amazon: { price: 'Free', link: 'https://httpd.apache.org/' }, flipkart: { price: 'Free', link: 'https://httpd.apache.org/' }, official: { price: 'Free', link: 'https://httpd.apache.org/' } }
  },

  { id: 455, title: 'Vercel', subtitle: 'Frontend Cloud & Next.js creator', category: 'TOOLS', isNew: true, features: { Type: 'Deployment', Subscription: 'Freemium' },
    specifications: { Type: 'Platform as a Service', Platform: 'Web', Support: 'Global Edge Network', License: 'Proprietary Service', Description: 'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.', PrimaryUseCase: 'Zero-configuration deployment for frontend frameworks and serverless functions.', Ecosystem: 'Next.js, React, Edge Functions', FreeTier: 'Hobby (Free forever for non-commercial)', ProTier: '$20/mo per user (1TB Bandwidth)', EnterpriseTier: 'Custom pricing (Enhanced Security, SLA)' },
    scores: { Reliability: 99, Speed: 100, EaseOfUse: 98 },
    prices: { official: { price: 'Freemium', link: 'https://vercel.com/' } }
  },
  { id: 456, title: 'Netlify', subtitle: 'Connect everything. Build anywhere.', category: 'TOOLS', isNew: false, features: { Type: 'Deployment', Subscription: 'Freemium' },
    specifications: { Type: 'Platform as a Service', Platform: 'Web', Support: 'Jamstack', License: 'Proprietary Service', Description: 'A unified platform that automates your code to create high-performant, easily maintainable sites and web apps.', PrimaryUseCase: 'Jamstack applications with automated edge deployments.', Ecosystem: 'Gatsby, Nuxt, Edge CDN', FreeTier: 'Starter (100GB Bandwidth, 300 build mins)', ProTier: '$19/mo per user (1TB Bandwidth)', EnterpriseTier: 'Custom pricing (99.99% Uptime SLA)' },
    scores: { Reliability: 98, Speed: 97, EaseOfUse: 99 },
    prices: { official: { price: 'Freemium', link: 'https://www.netlify.com/' } }
  },
  { id: 457, title: 'Render', subtitle: 'Unified Cloud to build and run all your apps', category: 'TOOLS', isNew: true, features: { Type: 'Deployment', Subscription: 'Freemium' },
    specifications: { Type: 'Cloud Platform', Platform: 'Web / Backend', Support: 'Docker, Node, Python', License: 'Proprietary Service', Description: 'Render is a unified cloud to build and run all your apps and websites with free TLS certificates, a global CDN, DDoS protection, private networks, and auto deploys from Git.', PrimaryUseCase: 'Deploying full-stack applications, databases, and cron jobs effortlessly.', Ecosystem: 'PostgreSQL, Redis, Web Services', FreeTier: 'Individual (Static Sites, Free Web Services spin down)', ProTier: 'Team $19/mo (Scale memory/CPU as needed)', EnterpriseTier: 'Organization (SSO, Role-based access)' },
    scores: { Versatility: 95, Usability: 96, Value: 98 },
    prices: { official: { price: 'Freemium', link: 'https://render.com/' } }
  },
  { id: 458, title: 'Heroku', subtitle: 'Cloud application platform', category: 'TOOLS', isNew: false, features: { Type: 'Deployment', Subscription: 'Paid' },
    specifications: { Type: 'Platform as a Service', Platform: 'Backend', Support: 'Polyglot', License: 'Proprietary Service', Description: 'A platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud.', PrimaryUseCase: 'Simple container-based application hosting (Dynos).', Ecosystem: 'Salesforce, Node, Ruby, Postgres', FreeTier: 'No longer available. Starts at Eco ($5)', ProTier: 'Standard Dynos ($25-$50/mo)', EnterpriseTier: 'Private Spaces (Network isolation, compliance)' },
    scores: { Ecosystem: 99, Reliability: 95, Pricing: 70 },
    prices: { official: { price: 'Paid Plans', link: 'https://www.heroku.com/' } }
  },
  { id: 459, title: 'AWS Amplify', subtitle: 'Build extensible, full-stack web and mobile apps', category: 'TOOLS', isNew: false, features: { Type: 'Deployment', Subscription: 'Pay-as-you-go' },
    specifications: { Type: 'Cloud Platform', Platform: 'Web / Mobile', Support: 'AWS Cloud', License: 'Proprietary Service', Description: 'A set of purpose-built tools and features that lets frontend web and mobile developers quickly and easily build full-stack applications on AWS.', PrimaryUseCase: 'Seamless integration of frontend code with AWS backend services (Auth, Storage, APIs).', Ecosystem: 'AWS ecosystem, React Native, Vue', FreeTier: 'Free tier limits for 12 months (1000 build mins, 15GB bandwidth)', ProTier: 'Pay-as-you-go ($0.01/build min, $0.15/GB)', EnterpriseTier: 'Part of AWS compliance, massive scale' },
    scores: { Scalability: 100, Features: 96, Complexity: 85 },
    prices: { official: { price: 'Pay-as-you-go', link: 'https://aws.amazon.com/amplify/' } }
  },

  { id: 455, title: 'Vercel', subtitle: 'Frontend Cloud & Next.js creator', category: 'TOOLS', isNew: true, features: { Type: 'Deployment', Subscription: 'Freemium' },
    specifications: { Type: 'Platform as a Service', Platform: 'Web', Support: 'Global Edge Network', License: 'Proprietary Service', Description: 'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.', PrimaryUseCase: 'Zero-configuration deployment for frontend frameworks and serverless functions.', Ecosystem: 'Next.js, React, Edge Functions', FreeTier: 'Hobby (Free forever for non-commercial)', ProTier: '$20/mo per user (1TB Bandwidth)', EnterpriseTier: 'Custom pricing (Enhanced Security, SLA)' },
    scores: { Reliability: 99, Speed: 100, EaseOfUse: 98 },
    prices: { official: { price: 'Freemium', link: 'https://vercel.com/' } }
  },
  { id: 456, title: 'Netlify', subtitle: 'Connect everything. Build anywhere.', category: 'TOOLS', isNew: false, features: { Type: 'Deployment', Subscription: 'Freemium' },
    specifications: { Type: 'Platform as a Service', Platform: 'Web', Support: 'Jamstack', License: 'Proprietary Service', Description: 'A unified platform that automates your code to create high-performant, easily maintainable sites and web apps.', PrimaryUseCase: 'Jamstack applications with automated edge deployments.', Ecosystem: 'Gatsby, Nuxt, Edge CDN', FreeTier: 'Starter (100GB Bandwidth, 300 build mins)', ProTier: '$19/mo per user (1TB Bandwidth)', EnterpriseTier: 'Custom pricing (99.99% Uptime SLA)' },
    scores: { Reliability: 98, Speed: 97, EaseOfUse: 99 },
    prices: { official: { price: 'Freemium', link: 'https://www.netlify.com/' } }
  },
  { id: 457, title: 'Render', subtitle: 'Unified Cloud to build and run all your apps', category: 'TOOLS', isNew: true, features: { Type: 'Deployment', Subscription: 'Freemium' },
    specifications: { Type: 'Cloud Platform', Platform: 'Web / Backend', Support: 'Docker, Node, Python', License: 'Proprietary Service', Description: 'Render is a unified cloud to build and run all your apps and websites with free TLS certificates, a global CDN, DDoS protection, private networks, and auto deploys from Git.', PrimaryUseCase: 'Deploying full-stack applications, databases, and cron jobs effortlessly.', Ecosystem: 'PostgreSQL, Redis, Web Services', FreeTier: 'Individual (Static Sites, Free Web Services spin down)', ProTier: 'Team $19/mo (Scale memory/CPU as needed)', EnterpriseTier: 'Organization (SSO, Role-based access)' },
    scores: { Versatility: 95, Usability: 96, Value: 98 },
    prices: { official: { price: 'Freemium', link: 'https://render.com/' } }
  },
  { id: 458, title: 'Heroku', subtitle: 'Cloud application platform', category: 'TOOLS', isNew: false, features: { Type: 'Deployment', Subscription: 'Paid' },
    specifications: { Type: 'Platform as a Service', Platform: 'Backend', Support: 'Polyglot', License: 'Proprietary Service', Description: 'A platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud.', PrimaryUseCase: 'Simple container-based application hosting (Dynos).', Ecosystem: 'Salesforce, Node, Ruby, Postgres', FreeTier: 'No longer available. Starts at Eco ($5)', ProTier: 'Standard Dynos ($25-$50/mo)', EnterpriseTier: 'Private Spaces (Network isolation, compliance)' },
    scores: { Ecosystem: 99, Reliability: 95, Pricing: 70 },
    prices: { official: { price: 'Paid Plans', link: 'https://www.heroku.com/' } }
  },
  { id: 459, title: 'AWS Amplify', subtitle: 'Build extensible, full-stack web and mobile apps', category: 'TOOLS', isNew: false, features: { Type: 'Deployment', Subscription: 'Pay-as-you-go' },
    specifications: { Type: 'Cloud Platform', Platform: 'Web / Mobile', Support: 'AWS Cloud', License: 'Proprietary Service', Description: 'A set of purpose-built tools and features that lets frontend web and mobile developers quickly and easily build full-stack applications on AWS.', PrimaryUseCase: 'Seamless integration of frontend code with AWS backend services (Auth, Storage, APIs).', Ecosystem: 'AWS ecosystem, React Native, Vue', FreeTier: 'Free tier limits for 12 months (1000 build mins, 15GB bandwidth)', ProTier: 'Pay-as-you-go ($0.01/build min, $0.15/GB)', EnterpriseTier: 'Part of AWS compliance, massive scale' },
    scores: { Scalability: 100, Features: 96, Complexity: 85 },
    prices: { official: { price: 'Pay-as-you-go', link: 'https://aws.amazon.com/amplify/' } }
  },

  // Memory (RAM)
  { id: 501, title: 'Corsair Vengeance RGB DDR5', subtitle: 'Popular RGB DDR5', category: 'MEMORY (RAM)', isNew: false, features: { Capacity: '32GB (2x16GB)', Speed: '6000MT/s' },
    specifications: { Capacity: '32GB (2x16GB)', Speed: '6000 MT/s', CAS: 'CL36', Voltage: '1.35V', Profile: 'XMP 3.0 / EXPO', RGB: 'Yes (iCUE)' },
    scores: { Speed: 90, Reliability: 95, Value: 85, Aesthetics: 96 },
    prices: { amazon: { price: '$110', link: getURL('amazon', 'Corsair Vengeance RGB DDR5 32GB 6000') }, flipkart: { price: '₹11,000', link: getURL('flipkart', 'Corsair Vengeance DDR5') }, official: { price: '$120', link: getURL('official', 'Corsair Vengeance RGB DDR5') } }
  },
  { id: 502, title: 'G.Skill Trident Z5 RGB NEO', subtitle: 'Optimized for AMD EXPO', category: 'MEMORY (RAM)', isNew: true, features: { Capacity: '32GB (2x16GB)', Speed: '6000MT/s' },
    specifications: { Capacity: '32GB (2x16GB)', Speed: '6000 MT/s', CAS: 'CL30', Voltage: '1.35V', Profile: 'EXPO (AMD)', RGB: 'Yes' },
    scores: { Speed: 95, Reliability: 94, Value: 88, Aesthetics: 98 },
    prices: { amazon: { price: '$115', link: getURL('amazon', 'G.Skill Trident Z5 RGB NEO 32GB') }, flipkart: { price: '₹12,000', link: getURL('flipkart', 'G.Skill Trident Z5 NEO') }, official: { price: '$130', link: getURL('official', 'G.Skill Trident Z5 NEO') } }
  },
  { id: 503, title: 'Kingston FURY Beast DDR5', subtitle: 'Reliable performance', category: 'MEMORY (RAM)', isNew: false, features: { Capacity: '32GB (2x16GB)', Speed: '5600MT/s' },
    specifications: { Capacity: '32GB (2x16GB)', Speed: '5600 MT/s', CAS: 'CL40', Voltage: '1.25V', Profile: 'XMP 3.0', RGB: 'No' },
    scores: { Speed: 80, Reliability: 98, Value: 92, Aesthetics: 75 },
    prices: { amazon: { price: '$90', link: getURL('amazon', 'Kingston FURY Beast DDR5 32GB') }, flipkart: { price: '₹9,000', link: getURL('flipkart', 'Kingston FURY Beast') }, official: { price: '$100', link: getURL('official', 'Kingston FURY Beast') } }
  },
  { id: 504, title: 'Crucial Pro DDR5', subtitle: 'No-nonsense stability', category: 'MEMORY (RAM)', isNew: true, features: { Capacity: '32GB (2x16GB)', Speed: '5600MT/s' },
    specifications: { Capacity: '32GB (2x16GB)', Speed: '5600 MT/s', CAS: 'CL46', Voltage: '1.1V', Profile: 'JEDEC / XMP 3.0', RGB: 'No' },
    scores: { Speed: 78, Reliability: 99, Value: 95, Aesthetics: 70 },
    prices: { amazon: { price: '$85', link: getURL('amazon', 'Crucial Pro DDR5 32GB') }, flipkart: { price: '₹8,500', link: getURL('flipkart', 'Crucial Pro DDR5') }, official: { price: '$95', link: getURL('official', 'Crucial Pro DDR5') } }
  },
  { id: 505, title: 'TeamGroup T-Force Delta RGB', subtitle: 'Striking aesthetics', category: 'MEMORY (RAM)', isNew: false, features: { Capacity: '32GB (2x16GB)', Speed: '6400MT/s' },
    specifications: { Capacity: '32GB (2x16GB)', Speed: '6400 MT/s', CAS: 'CL40', Voltage: '1.35V', Profile: 'XMP 3.0', RGB: 'Yes (120° Angle)' },
    scores: { Speed: 96, Reliability: 92, Value: 90, Aesthetics: 97 },
    prices: { amazon: { price: '$105', link: getURL('amazon', 'TeamGroup T-Force Delta RGB 32GB') }, flipkart: { price: '₹10,500', link: getURL('flipkart', 'TeamGroup T-Force Delta') }, official: { price: '$110', link: getURL('official', 'TeamGroup T-Force Delta') } }
  },
  { id: 506, title: 'Corsair Vengeance LPX DDR4', subtitle: 'Classic DDR4 low profile', category: 'MEMORY (RAM)', isNew: false, features: { Capacity: '16GB (2x8GB)', Speed: '3200MT/s' },
    specifications: { Capacity: '16GB (2x8GB)', Speed: '3200 MT/s', CAS: 'CL16', Voltage: '1.35V', Profile: 'XMP 2.0', RGB: 'No' },
    scores: { Speed: 70, Reliability: 98, Value: 99, Aesthetics: 75 },
    prices: { amazon: { price: '$40', link: getURL('amazon', 'Corsair Vengeance LPX DDR4 16GB') }, flipkart: { price: '₹3,500', link: getURL('flipkart', 'Corsair Vengeance LPX DDR4') }, official: { price: '$45', link: getURL('official', 'Corsair Vengeance LPX') } }
  },
  { id: 507, title: 'G.Skill Ripjaws V DDR4', subtitle: 'Best value DDR4', category: 'MEMORY (RAM)', isNew: false, features: { Capacity: '32GB (2x16GB)', Speed: '3600MT/s' },
    specifications: { Capacity: '32GB (2x16GB)', Speed: '3600 MT/s', CAS: 'CL18', Voltage: '1.35V', Profile: 'XMP 2.0', RGB: 'No' },
    scores: { Speed: 75, Reliability: 96, Value: 100, Aesthetics: 80 },
    prices: { amazon: { price: '$65', link: getURL('amazon', 'G.Skill Ripjaws V 32GB') }, flipkart: { price: '₹6,000', link: getURL('flipkart', 'G.Skill Ripjaws V') }, official: { price: '$70', link: getURL('official', 'G.Skill Ripjaws V') } }
  }
];

// Enrich with reviews and overall scores

const getProperImage = (product) => {
  const title = product.title.toLowerCase();
  
  // Use clearbit logos by brand name
  if (title.includes('samsung')) return 'https://logo.clearbit.com/samsung.com';
  if (title.includes('wd ') || title.includes('western digital')) return 'https://logo.clearbit.com/westerndigital.com';
  if (title.includes('crucial')) return 'https://logo.clearbit.com/crucial.com';
  if (title.includes('kingston')) return 'https://logo.clearbit.com/kingston.com';
  if (title.includes('sabrent')) return 'https://logo.clearbit.com/sabrent.com';
  if (title.includes('corsair')) return 'https://logo.clearbit.com/corsair.com';
  if (title.includes('teamgroup')) return 'https://logo.clearbit.com/teamgroupinc.com';
  if (title.includes('nvidia') || title.includes('rtx')) return 'https://logo.clearbit.com/nvidia.com';
  if (title.includes('amd') || title.includes('ryzen') || title.includes('radeon')) return 'https://logo.clearbit.com/amd.com';
  if (title.includes('intel') || title.includes('core i')) return 'https://logo.clearbit.com/intel.com';
  if (title.includes('g.skill')) return 'https://logo.clearbit.com/gskill.com';
  
  // Software logos
  const urlMatches = {
    'git': 'git-scm.com',
    'svn': 'subversion.apache.org',
    'mercurial': 'mercurial-scm.org',
    'vscodium': 'vscodium.com',
    'eclipse': 'eclipse.org',
    'intellij': 'jetbrains.com',
    'maven': 'maven.apache.org',
    'gradle': 'gradle.org',
    'ant': 'ant.apache.org',
    'jenkins': 'jenkins.io',
    'gitlab': 'gitlab.com',
    'tekton': 'tekton.dev',
    'docker': 'docker.com',
    'podman': 'podman.io',
    'containerd': 'containerd.io',
    'kubernetes': 'kubernetes.io',
    'nomad': 'nomadproject.io',
    'ansible': 'ansible.com',
    'puppet': 'puppet.com',
    'chef': 'chef.io',
    'redmine': 'redmine.org',
    'bugzilla': 'bugzilla.org',
    'taiga': 'taiga.io',
    'sonarqube': 'sonarqube.org',
    'eslint': 'eslint.org',
    'prettier': 'prettier.io',
    'selenium': 'selenium.dev',
    'cypress': 'cypress.io',
    'junit': 'junit.org',
    'postgresql': 'postgresql.org',
    'mysql': 'mysql.com',
    'mariadb': 'mariadb.org',
    'hoppscotch': 'hoppscotch.io',
    'insomnia': 'insomnia.rest',
    'bruno': 'usebruno.com',
    'prometheus': 'prometheus.io',
    'grafana': 'grafana.com',
    'zabbix': 'zabbix.com',
    'elasticsearch': 'elastic.co',
    'logstash': 'elastic.co',
    'fluentd': 'fluentd.org',
    'gitea': 'gitea.io',
    'nginx': 'nginx.org',
    'apache http': 'httpd.apache.org',
    'vercel': 'vercel.com',
    'netlify': 'netlify.com',
    'render': 'render.com',
    'heroku': 'heroku.com',
    'aws': 'aws.amazon.com',
    'crystaldiskmark': 'crystalmark.info',
    'wiztree': 'diskanalyzer.com',
    'rufus': 'rufus.ie',
    'cinebench': 'maxon.net',
    'hwmonitor': 'cpuid.com',
    'apple': 'apple.com',
    'galaxy ai': 'samsung.com'
  };

  for (const [key, domain] of Object.entries(urlMatches)) {
    if (title.includes(key)) {
      return `https://logo.clearbit.com/${domain}`;
    }
  }

  // Fallback to beautiful tech images by category
  if (product.category === 'SSD') return 'https://images.unsplash.com/photo-1597848212624-a19eb35e265c?w=400&h=400&fit=crop';
  if (product.category === 'GRAPHICS CARDS') return 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop';
  if (product.category === 'CPUs') return 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=400&fit=crop';
  if (product.category === 'MEMORY (RAM)') return 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&h=400&fit=crop';
  
  return `https://via.placeholder.com/400?text=${encodeURIComponent(product.title)}`;
};

productsD.forEach(p => {
  p.image = getProperImage(p);
  p.scores.Overall = calcOverall(p.scores);
  p.reviews = generateReviews(p.title, p.category);
  p.benchmarks = generateUserBenchmarks(p.category, p.scores.Overall);
  p.ratingStats = generateRatingStats(p.scores.Overall);
});

const content = `/* Auto-generated data.js with enriched reviews, stats, and prices */
export const productsData = ${JSON.stringify(productsD, null, 2)};

export const getQuestionsForCategory = (category) => {
  switch(category) {
    case 'SSD':
      return [
        { label: "1. Ultra-fast Gen5 Speeds (Future proof)", recommendation: "Crucial T700" },
        { label: "2. Best mix of Gen4 speed & price", recommendation: "Samsung 990 Pro" },
        { label: "3. Maximum terabytes for the budget", recommendation: "Crucial MX500" }
      ];
    case 'GRAPHICS CARDS':
      return [
        { label: "1. Flawless 4K & Raytracing at max settings", recommendation: "NVIDIA RTX 4090" },
        { label: "2. Great 1440p gaming & good value", recommendation: "AMD Radeon RX 7800 XT" },
        { label: "3. Budget 1080p e-sports", recommendation: "AMD Radeon RX 7600" }
      ];
    case 'CPUs':
      return [
        { label: "1. 100% focused on maximizing gaming FPS", recommendation: "AMD Ryzen 7 7800X3D" },
        { label: "2. Heavy video editing and mixed rendering", recommendation: "Intel Core i9-14900K" },
        { label: "3. Good everyday value out of the box", recommendation: "Intel Core i5-13600K" }
      ];
    case 'TOOLS':
      return [
        { label: "1. I want to benchmark/test my hardware limits", recommendation: "CrystalDiskMark or Cinebench R24" },
        { label: "2. I need to figure out where my disk space went", recommendation: "WizTree" },
        { label: "3. I'm comparing the latest ecosystem AI features", recommendation: "Apple Intelligence vs Galaxy AI" }
      ];
    case 'MEMORY (RAM)':
      return [
        { label: "1. Flashy RGB DDR5 for new systems", recommendation: "G.Skill Trident Z5 RGB NEO" },
        { label: "2. Standard DDR5 without the lights", recommendation: "Crucial Pro DDR5" },
        { label: "3. Older system needing DDR4 upgrade", recommendation: "Corsair Vengeance LPX DDR4" }
      ];
    default:
      return [
        { label: "1. I want the absolute best hardware", recommendation: "NVIDIA RTX 4090" },
        { label: "2. I care mostly about storage", recommendation: "Samsung 990 Pro" },
        { label: "3. I just need to build a cheap PC", recommendation: "AMD Radeon RX 7600" }
      ];
  }
};

export const generateAISummary = (product) => {
  const totRev = product.ratingStats ? product.ratingStats.total : product.reviews.length;
  const avgRating = product.ratingStats ? product.ratingStats.avg : (product.reviews.reduce((acc, curr) => acc + curr.rating, 0) / totRev).toFixed(1);
  return \`The \${product.title} is a highly regarded option in the \${product.category} space. Based on an AI analysis of over \${totRev.toLocaleString()} user reviews, it holds an average rating of \${avgRating} out of 5 stars. Users consistently praise its \${Object.keys(product.scores)[0]} score of \${product.scores[Object.keys(product.scores)[0]]}/100 and excellent performance. While a few reviewers noted minor concerns with \${Object.keys(product.scores)[2]}, the overall consensus is overwhelmingly positive, earning an impressive CompareXscore of \${product.scores.Overall}/100. It is a highly recommended choice for typical use cases.\`;
};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'data.js'), content, 'utf-8');
console.log('Successfully generated complete data.js with reviews, scores, specifications and prices.');
