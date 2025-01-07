const fs = require('fs');
const path = require('path');

// Regex nhận diện tiêu đề chương (bắt đầu bằng "第", tiếp theo là số hoặc chữ số tiếng Trung, và kết thúc bằng "章")
const chapterRegex = /^\s*第[\d零〇一二三四五六七八九十百千]+章.*$/;

function splitChapters(inputFile, outputFolder, jsonFile) {
  // Đọc nội dung file nguồn
  const content = fs.readFileSync(inputFile, 'utf8');

  // Tách nội dung thành các dòng
  const lines = content.split('\n');

  let chapterContent = '';
  let chapterTitle = null;
  const chapters = [];
  let chapNum = 0;

  lines.forEach((line) => {
    line = line.trim(); // Loại bỏ khoảng trắng thừa ở đầu và cuối dòng
    if (line === '') return; // Bỏ qua các dòng trống

    if (chapterRegex.test(line)) {
      // Nếu phát hiện tiêu đề chương
      if (chapterTitle) {
        // Lưu chương trước đó vào file
        chapNum++;
        const chapterFilePath = path.join(outputFolder, `${chapNum}.txt`);
        fs.writeFileSync(chapterFilePath, chapterContent.trim());
        chapters.push(chapterTitle); // Thêm tiêu đề chương vào danh sách
      }

      // Cập nhật tiêu đề chương mới
      chapterTitle = line;
      chapterContent = line + '\n'; // Tiêu đề chương luôn nằm ở đầu nội dung chương
    } else {
      // Thêm nội dung vào chương hiện tại
      chapterContent += line + '\n';
    }
  });

  // Lưu chương cuối cùng nếu còn nội dung
  if (chapterTitle) {
    chapNum++;
    const chapterFilePath = path.join(outputFolder, `${chapNum}.txt`);
    fs.writeFileSync(chapterFilePath, chapterContent.trim());
    chapters.push(chapterTitle);
  }

  // Lưu danh sách tiêu đề chương vào file JSON
  const jsonContent = JSON.stringify(chapters, null, 2);
  fs.writeFileSync(jsonFile, jsonContent, { encoding: 'utf8' });

  console.log(`Đã tách thành ${chapNum} chương và lưu tiêu đề vào file JSON.`);
}

// Sử dụng hàm
const inputFile = 'C:/Users/Ad/Videos/tele/1.txt'; // Đường dẫn đến file TXT của bạn
const outputFolder = 'C:/Users/Ad/Videos/tele/output'; // Thư mục để lưu các file chương
const jsonFile = 'C:/Users/Ad/Videos/tele/output'; // Đường dẫn đến file JSON để lưu danh sách chương

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Gọi hàm tách chương
splitChapters(inputFile, outputFolder, jsonFile);
