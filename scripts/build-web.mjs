import { spawnSync } from 'node:child_process';
const result = spawnSync(process.platform === 'win32' ? 'flutter.bat' : 'flutter',
  ['build', 'web', '--release', '--output', 'dist', '--no-web-resources-cdn'],
  { stdio: 'inherit', shell: process.platform === 'win32' });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
