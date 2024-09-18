const fs = require('fs');
const path = require('path');

// Đọc file và chuyển nội dung thành đối tượng {chinese_word: vietnam_word}
function readFileToDict(filePath) {
  const data = fs.readFileSync(filePath, 'utf8').split('\n');
  const dict = {};
  data.forEach((line) => {
    if (line.trim()) {
      const [chinese, vietnam] = line.split('=');
      const vietnamWords = vietnam.trim().split('/');
      dict[chinese.trim()] = vietnamWords;
    }
  });
  return dict;
}

// Ghi đối tượng {chinese_word: vietnam_word} vào file
function writeDictToFile(filePath, dict) {
  const lines = Object.entries(dict).map(([chinese, vietnamWords]) => {
    const vietnam = vietnamWords.join('/');
    return `${chinese}=${vietnam}`;
  });
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

// Xử lý các nghĩa trùng lặp và lỗi cấu trúc
function removeRedundantMeanings(dict) {
  const processedDict = {};

  Object.entries(dict).forEach(([chinese, vietnamWords]) => {
    const uniqueVietnamWords = [];

    // Duyệt qua các phần nghĩa theo thứ tự ban đầu
    vietnamWords.forEach((word) => {
      // Kiểm tra xem có phần nào dài hơn chứa phần hiện tại không
      const isContained = uniqueVietnamWords.some((existingWord) =>
        existingWord.includes(word)
      );
      if (!isContained) {
        uniqueVietnamWords.push(word);
      }
    });

    processedDict[chinese] = uniqueVietnamWords;
  });

  return processedDict;
}

// Bắt đầu
function main() {
  const inputFilePath = path.join(__dirname, 'different_VP_fix.txt');
  const outputFilePath = path.join(__dirname, 'different_VP_fix2.txt');

  // Đọc dữ liệu từ file input.txt
  const dict = readFileToDict(inputFilePath);

  // Xử lý các nghĩa trùng lặp và lỗi cấu trúc
  const processedDict = removeRedundantMeanings(dict);

  // Ghi vào file output.txt
  writeDictToFile(outputFilePath, processedDict);

  console.log('Completed.');
}

main();
