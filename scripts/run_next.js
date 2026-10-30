const { spawn } = require('child_process');
const path = require('path');

// Keep Next.js dev server running with stdin ignored so EOF does not terminate it
const nextBin = path.join(__dirname, '../node_modules/next/dist/bin/next');
const child = spawn(process.execPath, [nextBin, 'dev', '-p', '3000'], {
  stdio: ['ignore', 'inherit', 'inherit'],
  windowsHide: false
});

child.on('exit', (code, signal) => {
  console.log(`Next.js process exited with code ${code} and signal ${signal}`);
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));

