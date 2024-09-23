const fs = require('fs');
const path = require('path');

// Hàm đọc file và trả về đối tượng { chineseWord: meaning }
function readFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8');
  return data.split('\n').reduce((acc, line) => {
    if (line.trim()) {
      const [chineseWord, meaning] = line.split('=');
      acc[chineseWord.trim()] = meaning.trim();
    }
    return acc;
  }, {});
}

// Hàm ghi nội dung ra file từ đối tượng { chineseWord: meaning }
function writeFile(filePath, data) {
  const content = Object.entries(data)
    .map(([chineseWord, meaning]) => `${chineseWord}=${meaning}`)
    .join('\n');
  fs.writeFileSync(filePath, content, 'utf-8');
}

// Đường dẫn đến file a và b
const fileAPath = path.join(__dirname, 'VP2.txt');
const fileBPath = path.join(__dirname, 'VietPhrase.txt');

// Đọc nội dung của file a và b
const fileAData = readFile(fileAPath);
const fileBData = readFile(fileBPath);

// Kiểm tra và chỉnh sửa file a, xóa cặp từ trong file b
Object.keys(fileAData).forEach((chineseWord) => {
  if (fileBData.hasOwnProperty(chineseWord)) {
    // Kết hợp nghĩa từ file a và b
    fileAData[
      chineseWord
    ] = `${fileAData[chineseWord]}/${fileBData[chineseWord]}`;
    // Xóa cặp từ này khỏi file b
    delete fileBData[chineseWord];

    console.log(
      `Đã merge và xóa: ${chineseWord}=${fileAData[chineseWord]}/${fileBData[chineseWord]}`
    );
  }
});

// Ghi lại nội dung vào file
writeFile(fileAPath, fileAData);
writeFile(fileBPath, fileBData);

console.log('Đã cập nhật file a.txt và b.txt!');
