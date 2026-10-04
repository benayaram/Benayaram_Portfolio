import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const output = 'tmp/qa';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || 'chrome',
  headless: true,
});
const results = [];
try {
  for (const size of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
    { width: 360, height: 800 },
    { width: 1920, height: 1080 },
  ]) {
    const context = await browser.newContext({ viewport: size, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toContainText('developer');
    const overflow = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      width: innerWidth,
    }));
    expect(overflow.scroll).toBe(overflow.width);
    await page.screenshot({ path: `${output}/home-${size.width}.png` });
    for (const id of [
      'about',
      'skills',
      'work',
      'certifications',
      'experience',
      'achievements',
      'contact',
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      expect(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth)).toBe(
        true,
      );
    }
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach((img) => {
        img.loading = 'eager';
      });
      await Promise.all(Array.from(document.images).map((img) => img.decode().catch(() => {})));
      scrollTo(0, 0);
    });
    await page.screenshot({ path: `${output}/full-${size.width}.png`, fullPage: true });
    if (size.width === 1440) {
      const axe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      await writeFile(`${output}/accessibility.json`, JSON.stringify(axe.violations, null, 2));
      expect(
        axe.violations.map((v) => ({
          id: v.id,
          description: v.description,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      await page.getByRole('button', { name: 'Flip developer ID card', exact: true }).focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('.id-card')).toHaveAttribute('aria-pressed', 'true');
      await page.getByRole('button', { name: 'Frontend', exact: true }).click();
      await expect(page.locator('.filter-chip.selected')).toHaveText('Frontend');
      await expect(page.locator('.element.dimmed').first()).toBeVisible();
      await page.getByRole('button', { name: 'React, Frontend', exact: true }).focus();
      await expect(page.locator('.skill-inspector h3')).toHaveText('React');
      await page.locator('.project-toggle').nth(1).click();
      await expect(page.locator('#project-hrm .unavailable')).toHaveText('Not available ↗');
      await expect(page.locator('#project-hrm .unavailable')).toBeDisabled();
      await page.locator('.project-toggle').nth(3).click();
      await expect(page.locator('#project-fbgl a').first()).toHaveAttribute(
        'href',
        /play.google.com/,
      );
      await expect(page.locator('video')).toHaveJSProperty('paused', true);
    }
    if (size.width === 390) {
      await page.getByRole('button', { name: 'Menu', exact: false }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await page.getByRole('button', { name: 'Menu', exact: false }).click();
      await page.getByRole('dialog').getByRole('link', { name: 'Work', exact: false }).click();
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await page.locator('.project-toggle').nth(2).click();
      await expect(page.locator('#project-ao-crm .unavailable')).toBeDisabled();
      await page.locator('#work').screenshot({ path: `${output}/work-mobile.png` });
    }
    expect(errors).toEqual([]);
    results.push({ viewport: size, overflow, errors });
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('video').evaluate((el) => el.play());
  await expect(page.locator('video')).toHaveJSProperty('paused', false);
  await page.locator('.sound-button').click();
  if (await page.locator('video').evaluate((el) => el.paused))
    await page.locator('.sound-button').click();
  await expect(page.locator('video')).toHaveJSProperty('muted', false);
  await page.locator('#skills').evaluate((el) => el.scrollIntoView());
  await expect(page.locator('video')).toHaveJSProperty('paused', true);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(page.locator('video')).toHaveJSProperty('paused', false);
  await page.locator('video').evaluate((el) => {
    el.currentTime = el.duration - 0.1;
  });
  await page.waitForTimeout(500);
  expect(await page.locator('video').evaluate((el) => el.currentTime)).toBeLessThan(2);
  await page.locator('#achievements').evaluate((el) => scrollTo(0, el.offsetTop + 500));
  await page.waitForTimeout(350);
  const track = await page
    .locator('.achievement-track')
    .evaluate((el) => getComputedStyle(el).transform);
  expect(track).not.toBe('none');
  results.push({
    media: 'Play, sound, offscreen pause, return resume, and loop verified',
    achievementTransform: track,
  });
  await context.close();
  await writeFile(`${output}/browser-results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
