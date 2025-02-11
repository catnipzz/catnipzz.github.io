const fs = require('fs');

function groupByMeaning(inputFile, outputFile) {
  const lines = fs
    .readFileSync(inputFile, 'utf-8')
    .split('\n')
    .filter((line) => line.trim());
  let meaningGroups = [];

  lines.forEach((line) => {
    const parts = line.split('=');
    if (parts.length < 2) return;

    const key = parts[0].trim();
    const meanings = new Set(parts[1].split('/').map((m) => m.trim()));

    let found = false;
    for (const group of meaningGroups) {
      if ([...meanings].some((m) => group.meanings.has(m))) {
        group.lines.push(line);
        meanings.forEach((m) => group.meanings.add(m));
        found = true;
        break;
      }
    }

    if (!found) {
      meaningGroups.push({ meanings, lines: [line] });
    }
  });

  // Chỉ ghi nhóm có hơn một dòng
  const outputData = meaningGroups
    .filter((group) => group.lines.length > 1)
    .map((group) => group.lines.join('\n'))
    .join('\n\n');

  fs.writeFileSync(outputFile, outputData, 'utf-8');
}

// Sử dụng
const inputFile = 'C:/Users/Ad/Desktop/hanlp/dictionaries2/VietPhrase.txt'; // Đường dẫn file đầu vào
const outputFile = 'grouped.txt'; // Đường dẫn file đầu ra
groupByMeaning(inputFile, outputFile);
