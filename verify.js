const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(`http://localhost:3000/weather/en`);

  await page.waitForTimeout(2000);

  await page.screenshot({ path: '/home/jules/verification/main_page_updated_translations.png' });

  // Open shortcut tutorial
  const shortcutBtn = await page.getByRole('button', { name: 'Shortcut Tutorial' });
  if (await shortcutBtn.isVisible()) {
      await shortcutBtn.click();
      await page.waitForTimeout(500); // wait for modal
      await page.screenshot({ path: '/home/jules/verification/shortcut_tutorial_updated.png' });

      const tcBtn = await page.getByRole('button', { name: '繁體中文' });
      if (await tcBtn.isVisible()) {
         await tcBtn.click();
         await page.waitForTimeout(500);
         await page.screenshot({ path: '/home/jules/verification/shortcut_tutorial_tc.png' });
      }

      // close it
      const closeBtns = await page.getByRole('button', { name: '關閉' });
      if (await closeBtns.isVisible()) {
          await closeBtns.click();
          await page.waitForTimeout(500);
      }
  }

  await browser.close();
  console.log("Screenshots captured");
})();
