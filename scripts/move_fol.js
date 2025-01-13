const fs = require('fs').promises;
const path = require('path');

async function moveFolder(src, dest) {
  try {
    await fs.rename(src, dest);
    console.log(`Moved folder from ${src} to ${dest}`);
  } catch (error) {
    console.error('Error moving folder:', error);
  }
}

// Sử dụng đường dẫn tuyệt đối hoặc tương đối của thư mục
const sourceFolder = 'E:/_TextNovelData/downnovel/aa';
const destinationFolder = 'F:/downnovel';

moveFolder(sourceFolder, destinationFolder);
