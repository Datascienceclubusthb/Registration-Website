const {chromium} = require(require('node:path').join(process.argv[2] || '.', 'playwright'));
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.clock.install({time: new Date('2026-10-22T12:00:00Z')});
  let posts = [];
  await page.route('**/api/register', async (route) => {
    posts.push(route.request().postDataJSON());
    await route.fulfill({status: 201, contentType: 'application/json', body: '{"ok":true}'});
  });
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({width, height: 900});
    await page.goto('http://localhost:3100');
    await page.locator('.editorial-countdown b').first().filter({hasText: /\d/}).waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `overflow home ${width}`
    );
    await page.screenshot({path: `/tmp/dsc-final-${width}.png`, fullPage: true});
  }
  await page.setViewportSize({width: 1440, height: 1000});
  await page.getByRole('tab').first().focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.getByRole('tab').nth(1).getAttribute('aria-selected'), 'true');
  await page.setViewportSize({width: 390, height: 844});
  await page.getByRole('button', {name: 'Menu'}).click();
  await page.getByRole('link', {name: 'The departments', exact: true}).click();
  assert.equal(
    await page.getByRole('button', {name: 'Menu'}).getAttribute('aria-expanded'),
    'false'
  );
  await page.goto('http://localhost:3100/register');
  await page.getByLabel('Full name').fill('UI Test');
  await page.getByLabel('Email address').fill('ui-test@example.com');
  await page.getByLabel('Faculty / major').fill('Computer Science');
  await page.getByLabel('Academic year').selectOption('2nd year');
  await page.screenshot({path: '/tmp/dsc-final-form.png', fullPage: true});
  assert(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'form overflow'
  );
  await page.getByRole('button', {name: 'Continue'}).click();
  await page.locator('#department-interest').selectOption({index: 1});
  await page.locator('#department-interest').selectOption({index: 2});
  await page.locator('#department-interest').selectOption('');
  await page.getByRole('button', {name: 'Continue'}).click();
  await page.getByRole('button', {name: 'Continue'}).click();
  await page.getByLabel('Why do you want').fill('I want to learn with the club.');
  await page
    .getByLabel('What would you like to contribute')
    .fill('I want to contribute to shared projects.');
  await page.getByRole('button', {name: 'Continue'}).click();
  assert.equal(posts.length, 0);
  await page.getByText('No preference yet', {exact: true}).waitFor();
  await page.getByRole('button', {name: 'Send application'}).click();
  await page.getByRole('heading', {name: 'Application received'}).waitFor();
  assert.deepEqual(posts[0].choices, []);
  assert.equal(posts.length, 1);
  const closed = await browser.newPage();
  await closed.clock.install({time: new Date('2026-11-01T12:00:00Z')});
  await closed.goto('http://localhost:3100/register');
  await closed.getByRole('heading', {name: 'Applications are closed'}).waitFor();
  await closed.goto('http://localhost:3100');
  await closed.getByText('This recruitment round has ended.').waitFor();
  await page.goto('http://localhost:3100/register');
  await page.evaluate(() =>
    localStorage.setItem(
      'dsc-application-draft',
      JSON.stringify({name: 'Restored draft', choices: ['ai', 'software']})
    )
  );
  await page.reload();
  await page.getByLabel('Full name').filter({visible: true}).waitFor();
  assert.equal(await page.getByLabel('Full name').inputValue(), 'Restored draft');
  await page.goto('http://localhost:3100/admin');
  await page.locator('input[type=password]').waitFor();
  assert(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'admin overflow'
  );
  await browser.close();
  console.log(
    'PASS: responsive 320/390/768/1440; tabs keyboard; mobile navigation; mocked full registration; no early submit; optional preference; deadline; admin login'
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
