const fs = require('fs');
const path = require('path');

// Đường dẫn tới thư mục root (thư mục gốc chứa các file .txt)
// const rootFolder = path.join(__dirname, 'a'); // thay 'a' bằng đường dẫn chính xác đến thư mục của bạn
const rootFolder = 'E:/_TextNovelData/uaa/txt/nz_15';
// Đọc tất cả các file trong thư mục root
fs.readdir(rootFolder, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Lọc ra các file có đuôi .txt
  const txtFiles = files.filter((file) => path.extname(file) === '.txt');

  // Nhóm các file theo prefix
  const groupedFiles = txtFiles.reduce((groups, file) => {
    // Lấy phần prefix từ tên file (trước chữ 'c')
    const prefix = file.split('c')[0];

    // Nếu chưa có nhóm cho prefix này, tạo mới
    if (!groups[prefix]) {
      groups[prefix] = [];
    }

    // Thêm file vào nhóm tương ứng
    groups[prefix].push(file);
    return groups;
  }, {});

  // Tạo subfolder và di chuyển các file vào từng subfolder tương ứng
  Object.keys(groupedFiles).forEach((prefix) => {
    const subfolder = path.join(rootFolder, prefix);

    // Nếu subfolder chưa tồn tại, tạo mới
    if (!fs.existsSync(subfolder)) {
      fs.mkdirSync(subfolder);
    }

    // Di chuyển các file vào subfolder
    groupedFiles[prefix].forEach((file) => {
      const oldPath = path.join(rootFolder, file);
      const newPath = path.join(subfolder, file);

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(`Error moving file ${file}:`, err);
        } else {
          // console.log(`Moved ${file} to ${subfolder}`);
        }
      });
    });
  });
});
