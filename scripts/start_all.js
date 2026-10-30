const { spawn } = require('child_process');

console.log('🚀 OPTOM elektro: Barcha tizimlarni ishga tushirish...');

// 1. Start Backend Express Server on Port 5000
const backend = spawn('node', ['server/server.js'], { stdio: 'inherit', shell: true });

// 2. Start Next.js Frontend Server on Port 3000
const frontend = spawn('cmd.exe', ['/c', 'npm', 'run', 'dev'], { stdio: 'inherit', shell: true });

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});

