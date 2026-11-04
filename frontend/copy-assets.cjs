const fs = require('node:fs/promises');
const path = require('node:path');

async function copyPublicAssets() {
  const source = path.resolve(__dirname, 'public');
  const destination = path.resolve(__dirname, 'dist');
  await fs.cp(source, destination, { recursive: true });
}

copyPublicAssets().catch((error) => {
  console.error('Failed to copy frontend public assets:', error);
  process.exitCode = 1;
});
