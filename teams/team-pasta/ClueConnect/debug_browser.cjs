const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  page.on('response', response => {
    if (!response.ok()) {
      console.log('BROWSER NETWORK ERROR:', response.url(), response.status());
    }
  });

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 10000 });
    console.log('Page loaded successfully');
    const html = await page.content();
    if (html.includes('Auth')) {
      console.log('Auth component found in HTML');
    } else {
      console.log('Auth component NOT found. Body:', await page.evaluate(() => document.body.innerHTML));
    }
  } catch (err) {
    console.error('Puppeteer navigation error:', err.message);
  }

  await browser.close();
})();
