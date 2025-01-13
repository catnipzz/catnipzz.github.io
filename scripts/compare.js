const fs = require('fs');
const path = require('path');

// Đọc file và chuyển nội dung thành đối tượng {chinese_word: vietnam_word}
function readFileToDict(filePath) {
  const data = fs.readFileSync(filePath, 'utf8').split('\n');
  const dict = {};
  data.forEach((line) => {
    if (line.trim()) {
      const [chinese, vietnam] = line.split('=');
      dict[chinese.trim()] = vietnam.trim();
    }
  });
  return dict;
}

// Ghi đối tượng {chinese_word: vietnam_word} vào file
function writeDictToFile(filePath, dict) {
  const lines = Object.entries(dict).map(
    ([chinese, vietnam]) => `${chinese}=${vietnam}`
  );
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

// Gộp các từ trùng theo yêu cầu và lọc bỏ trùng
function mergeAndFilterDuplicates(dictA, dictB) {
  const aFixDict = {};
  const bFixDict = {};
  const differentDict = {};

  // Duyệt qua dictA
  Object.entries(dictA).forEach(([chinese, vietnamA]) => {
    if (dictB[chinese]) {
      // Nếu tồn tại trong cả hai file, gộp lại
      const vietnamB = dictB[chinese];
      if (vietnamA !== vietnamB) {
        // Nếu nghĩa khác nhau, gộp lại và lưu vào different.txt
        differentDict[chinese] = `${vietnamA}/${vietnamB}`;
      } else {
        differentDict[chinese] = `${vietnamA}`;
      }
      // Nếu từ trùng lặp, không ghi vào a_fix.txt và b_fix.txt
    } else {
      // Nếu không có trong dictB, giữ lại trong a_fix.txt
      aFixDict[chinese] = vietnamA;
    }
  });

  // Duyệt qua dictB, thêm các từ không có trong dictA vào b_fix.txt
  Object.entries(dictB).forEach(([chinese, vietnamB]) => {
    if (!dictA[chinese]) {
      bFixDict[chinese] = vietnamB;
    }
  });

  return { aFixDict, bFixDict, differentDict };
}

// Bắt đầu
function main() {
  const fileAPath = path.join(__dirname, 'VietPhrase.txt');
  const fileBPath = path.join(__dirname, 'N2_fix.txt');

  // Đọc dữ liệu từ file a.txt và b.txt
  const dictA = readFileToDict(fileAPath);
  const dictB = readFileToDict(fileBPath);

  // Gộp và lọc các cặp từ trùng
  const { aFixDict, bFixDict, differentDict } = mergeAndFilterDuplicates(
    dictA,
    dictB
  );

  // Ghi vào file a_fix.txt và b_fix.txt (lọc bỏ các từ trùng lặp)
  writeDictToFile(path.join(__dirname, 'VP_fix.txt'), aFixDict);
  writeDictToFile(path.join(__dirname, 'N2.2_fix.txt'), bFixDict);

  // Ghi các từ có nghĩa khác nhau vào different.txt
  writeDictToFile(path.join(__dirname, 'diff_VP.txt'), differentDict);

  console.log('Completed.');
}

main();
