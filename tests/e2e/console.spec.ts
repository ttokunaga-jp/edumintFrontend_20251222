import { test, expect } from '@playwright/test';

test('no startTransition warnings in browser console', async ({ page }) => {
  const consoleMessages: Array<{type: string; text: string}> = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ type: msg.type(), text });
    // also print to node stdout for visibility in CI logs
    // eslint-disable-next-line no-console
    console.log('[browser console]', msg.type(), text);
  });

  await page.goto('http://localhost:5173/');
  // wait to allow app to mount and potential warnings to appear
  await page.waitForTimeout(2000);

  const found = consoleMessages.find(m => /startTransition/i.test(m.text));
  expect(found).toBeUndefined();
});