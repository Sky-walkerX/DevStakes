const google = require('googlethis');

async function check() {
  const options = { page: 0, safe: false };
  console.log('--- RTX 4090 Founders ---');
  let rtx = await google.image('Nvidia RTX 4090 Founders Edition front png', options);
  rtx.slice(0, 15).forEach(r => console.log(r.url));

  console.log('\n--- Taiga Logo ---');
  let taiga = await google.image('Taiga project management logo transparent png', options);
  taiga.slice(0, 5).forEach(r => console.log(r.url));
}
check();
