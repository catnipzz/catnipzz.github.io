const fs = require('fs-extra');
const path = require('path');

async function moveFolder(src, dest) {
  try {
    await fs.move(src, dest, { overwrite: true });
    console.log(`Moved folder from ${src} to ${dest}`);
  } catch (error) {
    console.error('Error moving folder:', error);
  }
}

// Đường dẫn thư mục nguồn và thư mục đích
const sourceFolder = path.join('E:', '_TextNovelData', 'downnovel', 'aa');
const destinationFolder = path.join('F:', 'downnovel', 'aa');

moveFolder(sourceFolder, destinationFolder);
