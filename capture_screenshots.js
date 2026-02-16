const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  
  const screens = [
    { file: 'screens/vertical/01_行動予定表.html', name: '01_行動予定表', width: 540, height: 960 },
    { file: 'screens/vertical/02_施工サイクル表.html', name: '02_施工サイクル表', width: 540, height: 960 },
    { file: 'screens/horizontal/01_協力業者一覧.html', name: '03_協力業者一覧', width: 960, height: 540 },
    { file: 'screens/horizontal/02_月間行事予定表.html', name: '04_月間行事予定表', width: 960, height: 540 },
    { file: 'screens/poster-patterns/pattern_A_フルスクリーン切替.html', name: '05_パターンA', width: 960, height: 540 },
    { file: 'screens/poster-patterns/pattern_B_分割表示.html', name: '06_パターンB', width: 960, height: 540 },
  ];
  
  // Create screenshots dir
  if (!fs.existsSync('docs/screenshots')) {
    fs.mkdirSync('docs/screenshots', { recursive: true });
  }
  
  for (const screen of screens) {
    const page = await browser.newPage();
    await page.setViewport({ width: screen.width, height: screen.height });
    const filePath = path.join(__dirname, screen.file);
    await page.goto('file://' + filePath, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: `docs/screenshots/${screen.name}.png`, fullPage: true });
    console.log(`Captured: ${screen.name}`);
    await page.close();
  }
  
  await browser.close();
  console.log('Done!');
})();
