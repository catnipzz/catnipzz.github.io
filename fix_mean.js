const fs = require('fs');
const path = require('path');

// Đọc file txt gốc
const inputFile = path.join(__dirname, './fixfile/diff_VP_fix_dup_2.txt');
const outputFile = path.join(__dirname, './fixfile/diff_VP_fix_dup_2.1.txt');

// Hàm loại bỏ nghĩa tiếng Việt trùng lặp (không phân biệt hoa thường)
const removeDuplicates = (line) => {
  const [chineseWord, vietnameseDefinitions] = line.split('=');
  if (!vietnameseDefinitions) return line;

  // Tách các nghĩa tiếng Việt
  let meanings = vietnameseDefinitions.split('/');

  // Sử dụng Map để lưu trữ các nghĩa duy nhất, không phân biệt hoa thường
  let uniqueMeaningsMap = new Map();
  meanings.forEach((meaning) => {
    const lowerCaseMeaning = meaning.trim().toLowerCase(); // chuyển về chữ thường để so sánh
    if (!uniqueMeaningsMap.has(lowerCaseMeaning)) {
      uniqueMeaningsMap.set(lowerCaseMeaning, meaning.trim()); // lưu lại nghĩa gốc
    }
  });

  // Trả về kết quả với các nghĩa duy nhất
  let uniqueMeanings = Array.from(uniqueMeaningsMap.values());
  return `${chineseWord}=${uniqueMeanings.join('/')}`;
};

// Đọc file, xử lý từng dòng và ghi lại vào file mới
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Lỗi khi đọc file:', err);
    return;
  }

  // Tách từng dòng của file và xử lý
  const lines = data.split('\n');
  const processedLines = lines.map(removeDuplicates);

  // Ghi kết quả vào file mới
  fs.writeFile(outputFile, processedLines.join('\n'), (err) => {
    if (err) {
      console.error('Lỗi khi ghi file:', err);
      return;
    }
    console.log('Xử lý hoàn tất, file mới đã được lưu.');
  });
});
