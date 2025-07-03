const fs = require("fs");

module.exports.config = {
  name: "tea",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Md Tamim",
  description: "Send tea with reaction and video",
  commandCategory: "fun",
  usages: "tea",
  cooldowns: 5,
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;
  const msg = {
    body: "এই নাও চা খাও আমার বস তামিম বানাইছে 😋🤭",
    attachment: fs.createReadStream(__dirname + `/noprefix/tea.mp4`)
  };
  api.sendMessage(msg, threadID, messageID);
  api.setMessageReaction("🫖", messageID, (err) => {}, true);
};
