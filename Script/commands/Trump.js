module.exports.config = {
  name: "trump",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Comment on the board ( ͡° ͜ʖ ͡°)",
  commandCategory: "edit-img",
  usages: "trump [text]",
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
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
}

module.exports.run = async function({ api, event, args }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + '/cache/trump.png';
  var text = args.join(" ");
  if (!text) return api.sendMessage("Enter the content of the comment on the board", threadID, messageID);
  
  try {
    // ছবি ডাউনলোড করছেঃ
    let response = await axios.get(`https://i.imgur.com/ZtWfHHx.png`, { responseType: 'arraybuffer' });
    fs.writeFileSync(pathImg, response.data);

    // ছবি লোড এবং ক্যানভাস তৈরি করছেঃ
    let baseImage = await loadImage(pathImg);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    
    // লেখার ফন্ট সেট করছেঃ
    ctx.font = "400 45px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "start";
    
    // লেখার সাইজ কমাচ্ছেঃ যদি লেখা বড় হয়
    let fontSize = 250;
    while (ctx.measureText(text).width > 2600) {
      fontSize--;
      ctx.font = `400 ${fontSize}px Arial, sans-serif`;
    }
    
    // লেখা লাইন ভাগ করছেঃ
    const lines = await this.wrapText(ctx, text, 1160);
    
    // লেখা লিখছেঃ
    let y = 165;
    lines.forEach(line => {
      ctx.fillText(line, 60, y);
      y += fontSize + 10; // প্রতিটি লাইনের মাঝে ফাঁকা রাখছেঃ
    });

    // নতুন ছবি তৈরি এবং সেভ করছেঃ
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    // চ্যাটে পাঠাচ্ছেঃ
    return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);

  } catch (error) {
    return api.sendMessage("Sorry, there was an error processing your request.", threadID, messageID);
  }
}
