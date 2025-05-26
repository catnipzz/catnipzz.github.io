const fs = require('fs').promises;
const path = require('path');

// Danh sách giọng nói
const voices = [
  { id: 'en-AU', language: 'en' },
  { id: 'en-GB', language: 'en' },
  { id: 'en-US', language: 'en' },
  { id: 'af-ZA', language: 'af' },
  { id: 'sq', language: 'sq' },
  { id: 'ar-AE', language: 'ar' },
  { id: 'hy', language: 'hy' },
  { id: 'bn-BD', language: 'bn' },
  { id: 'bn-IN', language: 'bn' },
  { id: 'bs', language: 'bs' },
  { id: 'my', language: 'my' },
  { id: 'ca-ES', language: 'ca' },
  { id: 'cmn-Hant-TW', language: 'cmn' },
  { id: 'hr-HR', language: 'hr' },
  { id: 'cs-CZ', language: 'cs' },
  { id: 'da-DK', language: 'da' },
  { id: 'nl-NL', language: 'nl' },
  { id: 'eo', language: 'eo' },
  { id: 'et', language: 'et' },
  { id: 'fil-PH', language: 'fil' },
  { id: 'fi-FI', language: 'fi' },
  { id: 'fr-FR', language: 'fr' },
  { id: 'fr-CA', language: 'fr' },
  { id: 'de-DE', language: 'de' },
  { id: 'el-GR', language: 'el' },
  { id: 'gu', language: 'gu' },
  { id: 'hi-IN', language: 'hi' },
  { id: 'hu-HU', language: 'hu' },
  { id: 'is-IS', language: 'is' },
  { id: 'id-ID', language: 'id' },
  { id: 'it-IT', language: 'it' },
  { id: 'ja-JP', language: 'ja' },
  { id: 'kn', language: 'kn' },
  { id: 'km', language: 'km' },
  { id: 'ko-KR', language: 'ko' },
  { id: 'la', language: 'la' },
  { id: 'lv', language: 'lv' },
  { id: 'mk', language: 'mk' },
  { id: 'ml', language: 'ml' },
  { id: 'mr', language: 'mr' },
  { id: 'ne', language: 'ne' },
  { id: 'nb-NO', language: 'nb' },
  { id: 'pl-PL', language: 'pl' },
  { id: 'pt-BR', language: 'pt' },
  { id: 'ro-RO', language: 'ro' },
  { id: 'ru-RU', language: 'ru' },
  { id: 'sr-RS', language: 'sr' },
  { id: 'si', language: 'si' },
  { id: 'sk-SK', language: 'sk' },
  { id: 'es-MX', language: 'es' },
  { id: 'es-ES', language: 'es' },
  { id: 'sw', language: 'sw' },
  { id: 'sv-SE', language: 'sv' },
  { id: 'ta', language: 'ta' },
  { id: 'te', language: 'te' },
  { id: 'th-TH', language: 'th' },
  { id: 'tr-TR', language: 'tr' },
  { id: 'uk-UA', language: 'uk' },
  { id: 'ur', language: 'ur' },
  { id: 'cy', language: 'cy' },
  { id: 'vi-VN', language: 'vi' },
];

// Thay localStorage bằng file JSON
const tokenFile = path.join(__dirname, 'token.json');

async function readToken() {
  try {
    const data = await fs.readFile(tokenFile, 'utf8');
    return JSON.parse(data).SNlM0e;
  } catch (error) {
    return null;
  }
}

async function saveToken(SNlM0e) {
  try {
    await fs.writeFile(tokenFile, JSON.stringify({ SNlM0e }));
  } catch (error) {
    console.error('Lưu token thất bại:', error);
  }
}

async function execute(text, voice) {
  if (!text || typeof text !== 'string') {
    throw new Error('Văn bản phải là chuỗi không rỗng');
  }
  if (!voices || !Array.isArray(voices)) {
    throw new Error('Danh sách giọng nói không hợp lệ');
  }

  const voiceInfo = voices.find((e) => e.id === voice);
  const lang = voiceInfo ? voiceInfo.language : 'vi';

  let SNlM0e = await readToken();
  if (!SNlM0e) {
    SNlM0e = await extractSNlM0e();
    if (!SNlM0e) {
      throw new Error('Không thể lấy token SNlM0e');
    }
    await saveToken(SNlM0e);
  }

  const queryParams = new URLSearchParams({
    rpcids: 'XqA3Ic',
    bl: generateBardWebServer(),
    hl: lang,
    _reqid: generateReqID(),
    rt: 'c',
  });

  try {
    const response = await fetch(
      `https://gemini.google.com/_/BardChatUi/data/batchexecute?${queryParams}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // Có thể cần cookie xác thực, ví dụ:
          // 'Cookie': 'YOUR_COOKIE_HERE'
        },
        body: `f.req=${encodeURIComponent(
          getPayloadData(text, lang)
        )}&at=${SNlM0e}`,
      }
    );

    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }

    const textResponse = await response.text();
    const match = textResponse.match(/\[\["wrb.fr".*?"generic"]]/);
    if (!match) {
      throw new Error('Định dạng phản hồi không hợp lệ');
    }

    const jsonArray = JSON.parse(match[0]);
    const contentArray = JSON.parse(jsonArray[0][2]);
    return contentArray[0]; // Chuỗi base64
  } catch (error) {
    console.error('Yêu cầu TTS thất bại:', error);
    return null;
  }
}

// Hàm lưu base64 thành file MP3 cho Node.js
async function saveBase64AsAudio(base64, filename = 'output.mp3') {
  try {
    const buffer = Buffer.from(base64, 'base64');
    await fs.writeFile(filename, buffer);
    console.log('File audio đã được lưu:', filename);
  } catch (error) {
    console.error('Lưu file audio thất bại:', error);
  }
}

// Hàm phụ
function generateBardWebServer() {
  return 'boq_assistant-bard-web-server_20241014.09_p1';
}

function generateReqID() {
  return (
    100000 +
    parseInt(
      Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join(''),
      10
    )
  );
}

async function extractSNlM0e() {
  try {
    const response = await fetch('https://gemini.google.com');
    if (!response.ok) {
      throw new Error('Không thể truy cập trang Gemini');
    }
    const text = await response.text();
    const match = /SNlM0e":"(.*?)"/.exec(text);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Lấy SNlM0e thất bại:', error);
    return null;
  }
}

function getPayloadData(text, lang) {
  const data = ['XqA3Ic', [null, text, lang, null, 2], null, 'generic'];
  return JSON.stringify([[data]]);
}

// Ví dụ sử dụng
async function convertAndSave() {
  const text = 'Xin chào, đây là bài kiểm tra giọng nói';
  const voice = 'vi-VN'; // Chọn ID giọng từ danh sách voices
  const base64 = await execute(text, voice);
  if (base64) {
    await saveBase64AsAudio(base64, 'test_audio.mp3');
  } else {
    console.log('Không thể tạo audio');
  }
}

// Chạy
convertAndSave();
