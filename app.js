const { connect } = require("./bot/bot")
let bot;
let isSpawned = false;

const startBot = async (name, ip, port, version, res) => {
    bot = connect({
        username: name,
        auth: "offline",
        host: ip,
        port: port || "25565",
        version: version || false
    });

    bot.on("connect", async () => {
        isSpawned = true;
        console.log(`Bot spawned with username: ${bot.username}`);
        return res.redirect("/dashboard")
    });//e

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

    return bot.once("spawn", () => {
        resolve({
            username: bot.username,
            position: bot.entity.position,
            health: bot.health,
            food: bot.food,
            inventory: bot.inventory.items()
        })
    })
};

const botStatus = () => {
    return isSpawned;
};




module.exports = { startBot, stopBot, botInfo, botStatus };