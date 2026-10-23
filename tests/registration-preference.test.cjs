const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

// Exercise the actual TypeScript modules without Next's server or a database connection.
function load(relative, overrides = {}) {
  const filename = path.join(root, relative);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  const mod = {exports: {}};
  const localRequire = (id) => {
    if (id in overrides) return overrides[id];
    if (id.startsWith('@/')) return load(`src/${id.slice(2)}.ts`, overrides);
    return require(id);
  };
  vm.runInThisContext(`(function(require,module,exports){${source}\n})`, {filename})(
    localRequire,
    mod,
    mod.exports
  );
  return mod.exports;
}
const {parseDepartmentPreference: parse, restoreDepartmentPreference: restore} = load(
  'src/lib/department-preference.ts'
);
const first = 'data-science-ai';
const second = 'software-development';

const third = 'design-multimedia';
const fourth = 'human-resources';
const {randomUUID} = require('node:crypto');
test('accepts zero to three unique ranked interests and preserves order', () => {
  for (const value of [undefined, [], [first], [second, first], [third, second, first]])
    assert.deepEqual(parse(value), value || []);
});
test('rejects duplicates, unknown interests, malformed values and more than three', () => {
  for (const value of [
    [first, second, third, fourth],
    [first, first],
    ['unknown'],
    [null],
    null,
    first,
    {},
    [1],
  ])
    assert.equal(parse(value), null);
});
test('restores valid unique ranked preferences from legacy browser drafts', () => {
  const value = ['invalid', second, first, second, third, fourth];
  assert.deepEqual(restore(value), [second, first, third]);
  assert.equal(value.length, 6);
  assert.deepEqual(restore(null), []);
});
const valid = {
  name: 'Validation only',
  email: 'validation@example.org',
  university: 'USTHB',
  major: 'Computer Science',
  year: '3rd year',
  why: 'Learning together',
  contribute: 'Projects',
  consent: true,
};
function createRoute({expired = false, paused = false, unavailable = false} = {}) {
  const saved = [];
  const model = {
    create: async (value) => {
      const entry = {...value, _id: 'test-reference-' + saved.length};
      saved.push(entry);
      return entry;
    },
    findOne: ({applicationKey}) => ({
      select: () => ({
        lean: async () => saved.find((x) => x.applicationKey === applicationKey) || null,
      }),
    }),
  };
  const {POST} = load('src/app/api/register/route.ts', {
    'next/server': {
      NextResponse: {json: (value, options = {}) => new Response(JSON.stringify(value), options)},
    },
    '@/lib/mongoose': {__esModule: true, default: async () => {}},
    '@/models/Submission': {__esModule: true, default: model},
    '@/lib/recruitment': {isRecruitmentClosed: () => expired},
    '@/lib/recruitment-settings': {
      getRecruitmentState: async () => {
        if (unavailable) throw Error('simulated outage');
        return {open: !paused};
      },
    },
  });
  return {POST, saved};
}
function request(payload) {
  return new Request('http://localhost/api/register', {
    method: 'POST',
    body: JSON.stringify({applicationKey: randomUUID(), ...valid, ...payload}),
  });
}
async function withEnv(fn) {
  const old = process.env.MONGODB_URI;
  process.env.MONGODB_URI = 'mock-never-connected';
  try {
    await fn();
  } finally {
    if (old === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = old;
  }
}
test('API persists all preferences, optional answers, consent timestamp and reference', () =>
  withEnv(async () => {
    const {POST, saved} = createRoute();
    for (const choices of [[], [first], [third, second, first]]) {
      const r = await POST(
        request({choices, experience: 'Workshop', learn: 'Python', idea: 'Data project'})
      );
      assert.equal(r.status, 201);
      assert.match((await r.json()).reference, /^DSC-test-reference/);
    }
    assert.deepEqual(
      saved.map((x) => x.choices),
      [[], [first], [third, second, first]]
    );
    assert.equal(saved[0].experience, 'Workshop');
    assert.equal(saved[0].privacyVersion, '2026-10-23');
    assert.ok(saved[0].consentAt instanceof Date);
  }));
test('API rejects missing consent, invalid key, invalid rankings and malformed links before persistence', () =>
  withEnv(async () => {
    const {POST, saved} = createRoute();
    for (const payload of [
      {consent: false},
      {consent: undefined},
      {applicationKey: 'bad'},
      {choices: [first, first]},
      {choices: [first, second, third, fourth]},
      {choices: ['invalid']},
      {portfolio: 'https://'},
      {portfolio: 'javascript:alert(1)'},
    ]) {
      assert.equal((await POST(request(payload))).status, 400);
    }
    assert.equal(saved.length, 0);
  }));
test('retrying the same application key returns the same reference without another insert', () =>
  withEnv(async () => {
    const {POST, saved} = createRoute();
    const applicationKey = randomUUID();
    const a = await POST(request({applicationKey}));
    const b = await POST(request({applicationKey}));
    assert.equal(a.status, 201);
    assert.equal(b.status, 200);
    assert.deepEqual(await a.json(), await b.json());
    assert.equal(saved.length, 1);
  }));
test('deadline rejects before reading input, and admin pause prevents writes', () =>
  withEnv(async () => {
    const expired = createRoute({expired: true});
    assert.equal(
      (
        await expired.POST({
          json() {
            throw Error('must not parse');
          },
        })
      ).status,
      403
    );
    const paused = createRoute({paused: true});
    assert.equal((await paused.POST(request({}))).status, 403);
    assert.equal(paused.saved.length, 0);
  }));
test('storage outage never reports success', () =>
  withEnv(async () => {
    const {POST, saved} = createRoute({unavailable: true});
    assert.equal((await POST(request({}))).status, 503);
    assert.equal(saved.length, 0);
  }));
test('schema accepts historical and ranked interests and rejects invalid arrays', () => {
  const Submission = load('src/models/Submission.ts').default;
  for (const choices of [undefined, [], [first], [third, second, first]])
    assert.equal(new Submission({...valid, choices}).validateSync(), undefined);
  for (const choices of [[first, first], [first, second, third, fourth], ['invalid']])
    assert.ok(new Submission({...valid, choices}).validateSync()?.errors.choices);
});

test('recruitment changes require an admin session and reject malformed input', async () => {
  let writes = 0;
  let authorized = false;
  const {PATCH} = load('src/app/api/admin/recruitment/route.ts', {
    'next/server': {
      NextResponse: {json: (value, options = {}) => new Response(JSON.stringify(value), options)},
    },
    '@/lib/admin-auth': {hasAdminSession: async () => authorized},
    '@/lib/mongoose': {__esModule: true, default: async () => {}},
    '@/models/Recruitment': {
      __esModule: true,
      default: {
        findByIdAndUpdate: async () => {
          writes++;
        },
      },
    },
    '@/lib/recruitment-settings': {
      getRecruitmentState: async () => ({enabled: false, open: false}),
    },
  });
  assert.equal(
    (
      await PATCH({
        json() {
          throw Error('must not parse before auth');
        },
      })
    ).status,
    401
  );
  assert.equal(writes, 0);
  authorized = true;
  for (const body of [null, {}, {enabled: 'false'}])
    assert.equal((await PATCH({json: async () => body})).status, 400);
  assert.equal((await PATCH({json: async () => ({enabled: false})})).status, 200);
  assert.equal(writes, 1);
});
test('recruitment defaults open, honors admin pause, and never bypasses the deadline', async () => {
  const old = process.env.MONGODB_URI;
  process.env.MONGODB_URI = 'mock-never-connected';
  let setting = null;
  let expired = false;
  try {
    const {getRecruitmentState} = load('src/lib/recruitment-settings.ts', {
      '@/lib/mongoose': {__esModule: true, default: async () => {}},
      '@/models/Recruitment': {
        __esModule: true,
        default: {findById: () => ({lean: async () => setting})},
      },
      '@/lib/recruitment': {
        isRecruitmentClosed: () => expired,
        recruitmentClosesAt: '2026-10-31T23:59:00+01:00',
      },
    });
    assert.equal((await getRecruitmentState()).open, true);
    setting = {enabled: false};
    assert.equal((await getRecruitmentState()).open, false);
    setting = {enabled: true};
    expired = true;
    assert.equal((await getRecruitmentState()).open, false);
  } finally {
    if (old === undefined) delete process.env.MONGODB_URI;
    else process.env.MONGODB_URI = old;
  }
});
