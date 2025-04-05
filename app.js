const { connect } = require("./bot/bot")
let bot;
let isSpawned = false;

const startBot = async (name, ip, port, version, res, socket) => {
    bot = connect({
        username: name,
        auth: "offline",
        host: ip,
        port: port || "25565",
        version: version || false,
        socket
    });

    bot.on("spawn", async () => {
        isSpawned = true;
        console.log(`Bot spawned with username: ${bot.client.username}`);
        console.log(bot.client.health)
    });

    bot.on("disconnect", () => {
        isSpawned = false;
        console.log("Bot disconnected.");
    });

    bot.on("error", (err) => {
        console.error("Bot error:", err);
        isSpawned = false;
    });
};

const stopBot = async () => {
    if (bot) {
        bot.disconnect();
        isSpawned = false;
        console.log("Bot stopped.");
    } else {
        console.log("No bot to stop.");
    }
};

const botInfo = async () => {
    if (!bot || !isSpawned) {
        console.log("Bot is not initialized or spawned.");
        return null;
    }

    console.log(bot.health)
    return bot
};

const botStatus = () => {
    return isSpawned;
};




module.exports = { startBot, stopBot, botInfo, botStatus };