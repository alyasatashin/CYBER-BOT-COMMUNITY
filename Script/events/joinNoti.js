module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.2",
    credits: "Hinata bby Tamim",
    description: "Welcome message with video and group info",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path = join(__dirname, "cache", "joinvideo");
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
};

module.exports.run = async function({ api, event }) {
    const { join } = global.nodemodule["path"];
    const fs = require("fs-extra");
    const { threadID } = event;

    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || "Bot"}`, threadID, api.getCurrentUserID());
        return api.sendMessage({
            body: `🖤 আসসালামু আলাইকুম!\nধন্যবাদ আমাকে গ্রুপে অ্যাড করার জন্য 🌸\n\n🤖 Bot Owner: Tamim Boss\nযেকোনো কমান্ড দেখতে লিখুন:\n${global.config.PREFIX}help`,
            attachment: fs.createReadStream(__dirname + "/cache/joinvideo/join.mp4")
        }, threadID);
    } else {
        try {
            const { createReadStream, existsSync } = fs;
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);

            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            const videoPath = join(__dirname, "cache", "joinvideo", "join.mp4");

            let mentions = [], nameArray = [], memLength = [], i = 0;

            for (id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);
            }

            memLength.sort((a, b) => a - b);

            let msg = 
            "🌸 স্বাগতম {name}!\n" +
            "🏡 গ্রুপ: {threadName}\n" +
            "👤 মেম্বার নম্বর: {soThanhVien}\n" +
            "🤖 Bot Owner: Tamim Boss 💖\n\n" +
            "🌺 Hinata bby Tamim";

            msg = msg
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{soThanhVien}/g, memLength.join(', '))
                .replace(/\{threadName}/g, threadName);

            const formPush = existsSync(videoPath)
                ? { body: msg, attachment: createReadStream(videoPath), mentions }
                : { body: msg, mentions };

            return api.sendMessage(formPush, threadID);
        } catch (e) {
            return console.log(e);
        }
    }
};
