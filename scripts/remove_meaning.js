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
      dict[chinese.trim()] = new Set(vietnamWords);
    }
  });
  return dict;
}

// Ghi đối tượng {chinese_word: vietnam_word} vào file
function writeDictToFile(filePath, dict) {
  const lines = Object.entries(dict).map(([chinese, vietnamSet]) => {
    const vietnamWords = Array.from(vietnamSet).join('/');
    return `${chinese}=${vietnamWords}`;
  });
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

// Xử lý các nghĩa trùng lặp
function removeDuplicateMeanings(dict) {
  const processedDict = {};

  Object.entries(dict).forEach(([chinese, vietnamSet]) => {
    // Chuyển đổi Set thành Array để xử lý
    const vietnamArray = Array.from(vietnamSet);
    const uniqueVietnamArray = [...new Set(vietnamArray)];
    processedDict[chinese] = new Set(uniqueVietnamArray);
  });

  return processedDict;
}

// Bắt đầu
function main() {
  const inputFilePath = path.join(__dirname, './fixfile/diff_VP.txt');
  const outputFilePath = path.join(__dirname, './fixfile/diff_VP_fix_dup.txt');

  // Đọc dữ liệu từ file input.txt
  const dict = readFileToDict(inputFilePath);

  // Xử lý các nghĩa trùng lặp
  const processedDict = removeDuplicateMeanings(dict);

  // Ghi vào file output.txt
  writeDictToFile(outputFilePath, processedDict);

  console.log('Completed.');
}

main();
