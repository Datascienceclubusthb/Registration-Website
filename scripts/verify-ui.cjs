const {chromium} = require(require('node:path').join(process.argv[2] || '.', 'playwright'));
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox'],
  });
  const context = await browser.newContext();
  let posts = [];
  let enabled = true;
  let admin = false;
  let patches = [];
  const sample = {
    _id: 'test-reference',
    name: 'Review Example',
    email: 'review@example.org',
    university: 'USTHB',
    major: 'Computer Science',
    year: '3rd year',
    choices: ['software-development', 'data-science-ai'],
    skills: ['Python'],
    experience: 'Workshop',
    learn: 'Statistics',
    idea: 'Community dataset',
    why: 'Learning together',
    contribute: 'Projects',
    status: 'new',
    adminNote: '',
    consentAt: '2026-10-23T12:00:00Z',
    privacyVersion: '2026-10-23',
  };
  // Block every application/admin mutation and mock recruitment status before opening any page.
  await context.route('**/api/**', async (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    let status = 200;
    let body = {};
    if (path === '/api/recruitment') body = {enabled, open: enabled, expired: false};
    else if (path === '/api/register') {
      posts.push(req.postDataJSON());
      status = 201;
      body = {success: true, reference: 'DSC-test-reference'};
    } else if (path === '/api/admin/login') {
      admin = true;
      body = {success: true};
    } else if (path === '/api/admin/logout') {
      admin = false;
      body = {success: true};
    } else if (path === '/api/admin/recruitment') {
      enabled = req.postDataJSON().enabled;
      body = {enabled, open: enabled, expired: false};
    } else if (path === '/api/admin/submissions') {
      if (!admin) {
        status = 401;
        body = {error: 'Admin sign-in required.'};
      } else
        body = {
          submissions: [sample],
          total: 1,
          statuses: {new: 1},
          years: {'3rd year': 1},
          divisions: {'software-development': 1},
        };
    } else if (path.startsWith('/api/admin/submissions/')) {
      patches.push(req.postDataJSON());
      Object.assign(sample, req.postDataJSON());
      body = {submission: sample};
    } else {
      status = 501;
      body = {error: 'Unmocked API path blocked'};
    }
    await route.fulfill({status, contentType: 'application/json', body: JSON.stringify(body)});
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.clock.install({time: new Date('2026-10-23T12:00:00Z')});
  for (const width of [1440, 900, 390, 320]) {
    await page.setViewportSize({width, height: 1000});
    await page.goto('http://localhost:3100');
    await page.locator('.editorial-countdown b').first().filter({hasText: /\d/}).waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `home overflow ${width}`
    );
    await page.screenshot({path: `/tmp/dsc-world-${width}.png`, fullPage: true});
  }
  await page.getByRole('tab').first().focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('tab').nth(1).getAttribute('aria-selected'), 'true');
  await page.getByRole('button', {name: 'Menu'}).click();
  await page.getByRole('link', {name: 'Activities', exact: true}).click();
  assert.equal(
    await page.getByRole('button', {name: 'Menu'}).getAttribute('aria-expanded'),
    'false'
  );
  for (const details of await page.locator('#activities details').all()) {
    await details.locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await details.getAttribute('open'), '');
  }
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('http://localhost:3100/register');
  await page.getByRole('button', {name: 'Continue'}).click();
  await page.locator('#name-error').waitFor();
  assert.equal(await page.locator('#name').getAttribute('aria-invalid'), 'true');
  await page.getByLabel('Full name').fill('UI Test');
  await page.getByLabel('Student ID / Matricule').fill('002026123456');
  await page.getByLabel('Email address').fill('ui-test@example.org');
  await page.getByLabel('Faculty / Field of Study').fill('Computer Science');
  await page.getByLabel('Academic year').selectOption('3rd year');
  await page.screenshot({path: '/tmp/dsc-world-form.png', fullPage: true});
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.getByRole('button', {name: 'Continue'}).click();
  await page.locator('#preference-0').selectOption('software-development');
  await page.locator('#preference-1').selectOption('data-science-ai');
  await page.locator('#preference-2').selectOption('design-multimedia');
  await page.waitForFunction(
    () =>
      document.querySelector('#preference-1 option[value="software-development"]')?.disabled ===
      true
  );
  await page.getByRole('button', {name: 'Move preference 3 up'}).click();
  await page.waitForFunction(
    () => document.querySelector('#preference-1')?.value === 'design-multimedia'
  );
  await page.getByRole('button', {name: 'Move preference 2 down'}).click();
  await page.waitForFunction(
    () => document.querySelector('#preference-2')?.value === 'design-multimedia'
  );
  await page.screenshot({path: '/tmp/dsc-world-preferences.png', fullPage: true});
  await page.getByRole('button', {name: 'Continue'}).click();
  await page.getByRole('button', {name: 'Python', exact: false}).click();
  await page.getByLabel('Previous experience').fill('A workshop');
  await page.getByRole('button', {name: 'Continue'}).click();
  await page.getByLabel('Why do you want to join').fill('Learn with others');
  await page.getByLabel('How could you contribute').fill('Build shared tools');
  await page.getByLabel('What do you hope').fill('Statistics');
  await page.getByRole('button', {name: 'Continue'}).click();
  assert.equal(posts.length, 0);
  await page.getByRole('button', {name: 'SUBMIT APPLICATION'}).click();
  await page.getByText('Please read and agree to the application data notice.').waitFor();
  assert.equal(posts.length, 0);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', {name: 'SUBMIT APPLICATION'}).click();
  await page.getByRole('heading', {name: 'ACHIEVEMENT UNLOCKED!'}).waitFor();
  assert.equal(posts.length, 1);
  assert.deepEqual(posts[0].choices, [
    'software-development',
    'data-science-ai',
    'design-multimedia',
  ]);
  assert.equal(posts[0].consent, true);
  assert.equal(posts[0].studentId, '002026123456');
  await page.getByText('DSC-test-reference', {exact: true}).waitFor();
  await page.screenshot({path: '/tmp/dsc-world-success.png', fullPage: true});
  await page.goto('http://localhost:3100/register');
  await page.evaluate(() =>
    localStorage.setItem(
      'dsc-application-draft',
      JSON.stringify({
        name: 'Restored draft',
        choices: ['invalid', 'data-science-ai', 'data-science-ai', 'software-development'],
      })
    )
  );
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#name')?.value === 'Restored draft');
  assert.deepEqual(
    await page.evaluate(() => JSON.parse(localStorage.getItem('dsc-application-draft')).choices),
    ['data-science-ai', 'software-development']
  );
  await page.getByRole('button', {name: 'Clear my draft'}).click();
  assert.equal(await page.getByLabel('Full name').inputValue(), '');
  enabled = false;
  await page.reload();
  await page.getByRole('heading', {name: 'APPLICATIONS ARE CLOSED.'}).waitFor();
  await page.getByText(/Recruitment is currently paused/).waitFor();
  enabled = true;
  const expired = await context.newPage();
  await expired.clock.install({time: new Date('2026-11-01T12:00:00Z')});
  await expired.goto('http://localhost:3100/register');
  await expired.getByRole('heading', {name: 'APPLICATIONS ARE CLOSED.'}).waitFor();
  await page.goto('http://localhost:3100/privacy');
  await page.getByRole('heading', {name: 'YOUR INFORMATION. YOUR APPLICATION.'}).waitFor();
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.goto('http://localhost:3100/admin');
  await page.getByLabel('ADMIN EMAIL').fill('mock@example.org');
  await page.getByLabel('PASSWORD', {exact: true}).fill('mock-only');
  await page.getByRole('button', {name: 'SIGN IN'}).click();
  await page.getByRole('button', {name: 'Review Example'}).click();
  await page.getByText('Statistics', {exact: true}).waitFor();
  await page.getByLabel('INTERNAL ADMIN NOTES').fill('Mock review only');
  await page.getByRole('button', {name: 'SAVE INTERNAL NOTE'}).click();
  await page.getByText('Application updated.').waitFor();
  assert.equal(patches[0].adminNote, 'Mock review only');
  await page.getByRole('button', {name: 'Pause applications'}).click();
  await page.getByRole('button', {name: 'Open applications'}).waitFor();
  assert.equal(enabled, false);
  await page.screenshot({path: '/tmp/dsc-world-admin.png', fullPage: true});
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const retryContext = await browser.newContext();
  const attempts = [];
  await retryContext.route('**/api/**', async (route) => {
    if (new URL(route.request().url()).pathname === '/api/register') {
      attempts.push(route.request().postDataJSON());
      await route.fulfill(
        attempts.length === 1
          ? {status: 503, contentType: 'text/html', body: 'Service unavailable'}
          : {
              status: 201,
              contentType: 'application/json',
              body: JSON.stringify({success: true, reference: 'DSC-retry-test'}),
            }
      );
    } else
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: '{"error":"Temporary status outage"}',
      });
  });
  const retryPage = await retryContext.newPage();
  await retryPage.clock.install({time: new Date('2026-10-23T12:00:00Z')});
  await retryPage.addInitScript(() =>
    localStorage.setItem(
      'dsc-application-draft',
      JSON.stringify({
        name: 'Retry check',
        studentId: '002026123456',
        email: 'retry@example.invalid',
        university: 'USTHB',
        major: 'Computer Science',
        year: '3rd year',
        why: 'Learn together',
        contribute: 'Projects',
      })
    )
  );
  await retryPage.goto('http://localhost:3100/register');
  for (let i = 0; i < 4; i++) await retryPage.getByRole('button', {name: 'Continue'}).click();
  await retryPage.getByRole('checkbox').check();
  await retryPage.getByRole('button', {name: 'SUBMIT APPLICATION'}).click();
  await retryPage.getByRole('alert').filter({hasText: 'The server could not confirm'}).waitFor();
  await retryPage.getByRole('button', {name: 'SUBMIT APPLICATION'}).click();
  await retryPage.getByRole('heading', {name: 'ACHIEVEMENT UNLOCKED!'}).waitFor();
  assert.equal(attempts.length, 2);
  assert.equal(attempts[0].applicationKey, attempts[1].applicationKey);
  assert.equal(attempts[1].studentId, '002026123456');
  await retryContext.close();
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    'PASS: responsive campaign; departments; activities; keyboard; inline validation; ranked preferences; consent; mocked submission; draft; deadline/pause; privacy; admin notes/control; no page errors. No real API writes.'
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
