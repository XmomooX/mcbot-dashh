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

    bot.on("spawn", async () => {
        isSpawned = true;
        console.log(`Bot spawned with username: ${bot.client.username}`);
        console.log(bot.client.health)
        return res.redirect("http://localhost:3000/#dashboard")
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
    return bot.once("connect", () => {
        resolve({
            username: bot.client.username,
            position: bot.client.entity.position,
            health: bot.client.health,
            food: bot.client.food,
            inventory: bot.client.inventory.items()
        })
    })
};

const botStatus = () => {
    return isSpawned;
};




module.exports = { startBot, stopBot, botInfo, botStatus };