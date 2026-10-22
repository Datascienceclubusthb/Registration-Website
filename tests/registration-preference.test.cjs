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
    compilerOptions: {module: ts.ModuleKind.CommonJS, esModuleInterop: true},
  }).outputText;
  const mod = {exports: {}};
  const localRequire = (id) => {
    if (id in overrides) return overrides[id];
    if (id.startsWith('@/')) return load(`src/${id.slice(2)}.ts`, overrides);
    return require(id);
  };
  vm.runInThisContext(`(function(require,module,exports){${source}\n})`, {filename})(localRequire, mod, mod.exports);
  return mod.exports;
}
const {parseDepartmentPreference: parse, restoreDepartmentPreference: restore} = load('src/lib/department-preference.ts');
const first = 'data-science-ai';
const second = 'software-development';

test('a department interest is optional; a single known ID is accepted', () => {
  assert.deepEqual(parse(undefined), []);
  assert.deepEqual(parse([]), []);
  assert.deepEqual(parse([first]), [first]);
});
test('invalid values and multiple interests are rejected, including duplicate IDs', () => {
  for (const value of [[first,second], [first,first], ['invalid'], [null], null, first, {}, [1]]) assert.equal(parse(value), null);
});
test('older drafts retain their first valid interest without mutating saved input', () => {
  const old = ['invalid',second,first];
  assert.deepEqual(restore(old), [second]);
  assert.deepEqual(old, ['invalid',second,first]);
  assert.deepEqual(restore(null), []);
});
const valid = {name:'Validation only',email:'validation@example.org',university:'USTHB',major:'Computer Science',year:'3rd year',why:'Learning together',contribute:'Projects'};
function createRoute(closed = false) {
  const saved = [];
  const {POST} = load('src/app/api/register/route.ts', {
    'next/server': {NextResponse: {json: (value, options = {}) => new Response(JSON.stringify(value), options)}},
    '@/lib/mongoose': {__esModule:true,default:async () => {}},
    '@/models/Submission': {__esModule:true,default:{create:async value => {saved.push(value)}}},
    '@/lib/recruitment': {isRecruitmentClosed:() => closed},
  });
  return {POST,saved};
}
test('API stores an absent or single interest, and rejects multiple interests before storage', async () => {
  const old = process.env.MONGODB_URI;
  process.env.MONGODB_URI = 'mock-connection-never-used';
  try {
    const {POST,saved} = createRoute();
    for (const choices of [undefined,[],[first]]) {
      const response = await POST(new Request('http://localhost/api/register',{method:'POST',body:JSON.stringify({...valid,choices})}));
      assert.equal(response.status,201);
    }
    assert.deepEqual(saved.map(value=>value.choices),[[],[],[first]]);
    for (const choices of [[first,second],[first,first],['unknown'],null]) {
      const response = await POST(new Request('http://localhost/api/register',{method:'POST',body:JSON.stringify({...valid,choices})}));
      assert.equal(response.status,400);
    }
    assert.equal(saved.length,3);
  } finally {
    if(old===undefined) delete process.env.MONGODB_URI; else process.env.MONGODB_URI=old;
  }
});
test('API closes before parsing or storing an application', async () => {
  const {POST,saved} = createRoute(true);
  const response = await POST({json(){throw Error('should not parse a closed application')}});
  assert.equal(response.status,403); assert.equal(saved.length,0);
});
test('MongoDB schema accepts no preference but rejects invalid or multiple interests', () => {
  const Submission = load('src/models/Submission.ts').default;
  for(const choices of [undefined,[],[first]]) assert.equal(new Submission({...valid,choices}).validateSync(),undefined);
  for(const choices of [[first,second],['invalid']]) assert.ok(new Submission({...valid,choices}).validateSync()?.errors.choices);
});
