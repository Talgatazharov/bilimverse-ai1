const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { NextRequest } = require('next/server');

const filename = path.join(__dirname, '..', 'src/app/api/ai/route.ts');
const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2018 } }).outputText;
const loaded = new Module(filename, module);
loaded.filename = filename;
loaded.paths = Module._nodeModulePaths(path.dirname(filename));
loaded._compile(code, filename);

function request() {
  return new NextRequest('http://localhost:3001/api/ai', {
    method: 'POST',
    headers: { origin: 'http://localhost:3001', 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'explain', topic: '7 × 6 қалай есептеледі?', grade: 3 }),
  });
}

test('missing server key returns a child friendly error without leaking details', async () => {
  const previous = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  const log = console.error;
  const diagnostics = [];
  console.error = (...args) => diagnostics.push(args.join(' '));
  try {
    const response = await loaded.exports.POST(request());
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: 'AI көмекші әзірге қосылмаған.' });
    assert.match(diagnostics.join(' '), /AI provider is not configured/);
  } finally {
    console.error = log;
    if (previous === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previous;
  }
});

test('server route calls provider and only returns the answer', async () => {
  const previous = process.env.OPENAI_API_KEY;
  const originalFetch = global.fetch;
  process.env.OPENAI_API_KEY = 'test-placeholder';
  let sent;
  global.fetch = async (url, options) => {
    sent = { url, options };
    return new Response(JSON.stringify({ output: [{ content: [{ type: 'output_text', text: JSON.stringify({ message: '7 × 6 = 42. Алдымен 7 × 5 есептеп көр.' }) }] }] }), { status: 200 });
  };
  try {
    const response = await loaded.exports.POST(request());
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.match(body.message, /42/);
    assert.equal(JSON.stringify(body).includes('test-placeholder'), false);
    assert.equal(sent.url, 'https://api.openai.com/v1/responses');
    assert.equal(sent.options.headers.Authorization, 'Bearer test-placeholder');
  } finally {
    global.fetch = originalFetch;
    if (previous === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previous;
  }
});
