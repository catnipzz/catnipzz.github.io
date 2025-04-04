const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const { readdir, mkdir } = require('fs/promises');
const pLimit = require('p-limit');

// Đường dẫn thư mục
const txtFolder = 'D:/downnovelunzip/dn';
const outputFolder = 'D:/downnovelunzip/dn_utf8';

// Giới hạn số lượng tác vụ đồng thời
const limit = pLimit(10); // Chỉ xử lý 10 file cùng lúc

// Hàm decode một file bằng stream
function decodeFile(filePath, outputPath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(outputPath);
    const decodeStream = iconv.decodeStream('gbk');

    readStream.pipe(decodeStream).pipe(writeStream);

    writeStream.on('finish', () => {
      resolve(`Đã xử lý: ${path.basename(filePath)}`);
    });

    readStream.on('error', (err) => {
      reject(`Lỗi đọc file ${path.basename(filePath)}: ${err.message}`);
    });
    decodeStream.on('error', (err) => {
      reject(`Lỗi decode file ${path.basename(filePath)}: ${err.message}`);
    });
    writeStream.on('error', (err) => {
      reject(`Lỗi ghi file ${path.basename(filePath)}: ${err.message}`);
    });
  });
}

// Hàm duyệt thư mục đệ quy và xử lý từng file
async function processFiles() {
  async function walkDir(dir) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      const tasks = [];

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walkDir(fullPath); // Đệ quy cho thư mục con
        } else if (entry.name.endsWith('.txt')) {
          const relativePath = path.relative(txtFolder, fullPath);
          const outputPath = path.join(outputFolder, relativePath);

          // Tạo thư mục cha nếu chưa tồn tại
          await mkdir(path.dirname(outputPath), { recursive: true });

          // Thêm tác vụ decode với giới hạn
          tasks.push(
            limit(() =>
              decodeFile(fullPath, outputPath)
                .then(console.log)
                .catch(console.error)
            )
          );
        }
      }

      // Chờ các tác vụ trong thư mục hiện tại hoàn thành
      await Promise.all(tasks);
    } catch (error) {
      console.error(`Lỗi khi duyệt thư mục ${dir}: ${error.message}`);
    }
  }

  await walkDir(txtFolder);
}

// Hàm chính
async function decodeAllFiles() {
  try {
    console.log('Bắt đầu decode các file từ GBK sang UTF-8...');
    await mkdir(outputFolder, { recursive: true });
    await processFiles();
    console.log(`Hoàn thành! File UTF-8 được lưu tại ${outputFolder}.`);
  } catch (error) {
    console.error(`Lỗi tổng quát: ${error.message}`);
  }
}

// Chạy chương trình
decodeAllFiles();
