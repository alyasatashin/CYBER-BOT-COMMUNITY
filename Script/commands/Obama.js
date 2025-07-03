module.exports.config = {
  name: "obama",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Obama Tweet post",
  commandCategory: "edit-img",
  usages: "[text]",
  cooldowns: 10,
  dependencies: {
    "canvas": "",
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(line + words[0]).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    resolve(lines);
  });
}

module.exports.run = async function({ api, event, args }) {
  let { threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];

  let pathImg = __dirname + '/cache/obama.png';
  let text = args.join(" ");
  if (!text) return api.sendMessage("Enter the content of the comment on the board", threadID, messageID);

  try {
    // ইমেজ ডাউনলোড
    let response = await axios.get('https://i.imgur.com/6fOxdex.png', { responseType: 'arraybuffer' });
    fs.writeFileSync(pathImg, Buffer.from(response.data)); // utf-8 নয়!

    let baseImage = await loadImage(pathImg);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");

    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // টেক্সট স্টাইল সেট করা
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";

    // ফন্ট সাইজ অটোমেটিক ঠিক করা
    let fontSize = 250;
    ctx.font = `400 ${fontSize}px Arial, sans-serif`;
    while (ctx.measureText(text).width > 2600 && fontSize > 10) {
      fontSize--;
      ctx.font = `400 ${fontSize}px Arial, sans-serif`;
    }

    // টেক্সট লাইনগুলো আলাদাভাবে আঁকা (multiline support)
    const lines = await this.wrapText(ctx, text, 1160);
    let startY = 165;
    const lineHeight = fontSize + 10;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 60, startY + i * lineHeight);
    }

    // চূড়ান্ত ইমেজ তৈরি ও সেভ
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    // মেসেজ পাঠানো ও ফাইল ডিলিট
    return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);

  } catch (error) {
    return api.sendMessage("Error: " + error.message, threadID, messageID);
  }
};
