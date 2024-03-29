// global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

const email = process.env.EMAIL as string;
const password = process.env.PASSWORD as string;

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.linkedin.com/');
  await page.locator('input#session_key').fill(email);
  await page.locator('input#session_password').fill(password);
  await page.locator('text=Sign in').nth(1).click();
  // Save signed-in state to 'storageState.json'.
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}

export default globalSetup;