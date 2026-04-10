const fs = require('fs');

let data = fs.readFileSync('src/data.js', 'utf8');

data = data.replace(
  /"title":\s*"NVIDIA RTX 4090"[\s\S]*?"image":\s*"[^"]+"/g,
  match => match.replace(/"image":\s*"[^"]+"/, '"image": "https://i.pcmag.com/imagery/reviews/02NoiKaEFBsK5zddvNd2FFz-14.jpg"')
);

data = data.replace(
  /"title":\s*"Samsung Magician"[\s\S]*?"image":\s*"[^"]+"/g,
  match => match.replace(/"image":\s*"[^"]+"/, '"image": "/images/magician.png"')
);

data = data.replace(
  /"title":\s*"Taiga"[\s\S]*?"image":\s*"[^"]+"/g,
  match => match.replace(/"image":\s*"[^"]+"/, '"image": "https://raw.githubusercontent.com/taigaio/taiga-design/master/Logo/taiga_monocromo_blanco.png"')
);

data = data.replace(
  /"title":\s*"SonarQube \(Community\)"[\s\S]*?"image":\s*"[^"]+"/g,
  match => match.replace(/"image":\s*"[^"]+"/, '"image": "/images/sonarqube.png"')
);

fs.writeFileSync('src/data.js', data);
console.log('Fixed completely!');
