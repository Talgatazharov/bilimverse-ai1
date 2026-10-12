// Optional local browser QA. Uses a fresh profile, never a personal Chrome session.
import http from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
const root = path.resolve('dist');
const artifacts = path.resolve('build/browser-qa');
await mkdir(artifacts, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json',
  '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.otf': 'font/otf', '.ttf': 'font/ttf' };
const server = http.createServer(async (req, res) => {
  try {
    const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (requested === '/' ? '/index.html' : requested));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.setHeader('Content-Type', mime[path.extname(file)] ?? 'application/octet-stream');
    res.end(data);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
const chrome = spawn(process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=9229', `--user-data-dir=${path.join(artifacts, 'profile')}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
try {
  let pages;
  for (let i = 0; i < 40; i++) {
    try { pages = await (await fetch('http://127.0.0.1:9229/json')).json(); break; }
    catch { await sleep(250); }
  }
  if (!pages?.[0]) throw new Error('Fresh QA browser did not start');
  socket = new WebSocket(pages[0].webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let sequence = 0;
  const pending = new Map();
  const errors = [];
  socket.onmessage = event => {
    const result = JSON.parse(event.data);
    if (result.method === 'Runtime.exceptionThrown') errors.push(JSON.stringify(result.params.exceptionDetails));
    if (result.method === 'Log.entryAdded' && result.params.entry.level === 'error') errors.push(result.params.entry.text);
    const waiter = pending.get(result.id);
    if (waiter) { pending.delete(result.id); result.error ? waiter.reject(new Error(result.error.message)) : waiter.resolve(result.result); }
  };
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence; pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  await call('Page.enable'); await call('Runtime.enable'); await call('Log.enable');
  for (const [label, route, width] of [['entry', '/', 1440], ['world', '/#/world', 1440], ['phone-world', '/#/world', 390]]) {
    await call('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    await call('Page.navigate', { url: 'http://127.0.0.1:4173' + route });
    let ready = false;
    for (let i = 0; i < 120; i++) {
      await sleep(250);
      const check = await call('Runtime.evaluate', { expression: "!!document.querySelector('flutter-view') && !document.getElementById('boot')", returnByValue: true });
      if (check.result.value) { ready = true; break; }
    }
    if (!ready) {
      const shot = await call('Page.captureScreenshot', { format: 'png' });
      await writeFile(path.join(artifacts, 'failure.png'), Buffer.from(shot.data, 'base64'));
      const body = await call('Runtime.evaluate', { expression: 'document.body.innerHTML.slice(0, 3000)', returnByValue: true });
      throw new Error(`Flutter did not render ${label}: ${errors.join('; ')} ${body.result.value}`);
    }
    await sleep(3000);
    const shot = await call('Page.captureScreenshot', { format: 'png' });
    await writeFile(path.join(artifacts, `${label}.png`), Buffer.from(shot.data, 'base64'));
    console.log(`${label}: first frame rendered, screenshot saved`);
  }
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Browser smoke passed: no uncaught JavaScript exceptions.');
} finally {
  socket?.close(); chrome.kill(); server.close();
}
