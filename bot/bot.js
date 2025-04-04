const { EventEmitter } = require("events");
const mc = require("minecraft-protocol");
const versions = require("./versions");
const { loadHealth } = require("./functions/health");
const { loadChat } = require("./chat");
const { loadInventory, getHotBar } = require("./functions/inventory");
const { readdir, readdirSync } = require("fs");
const bot = new EventEmitter();
let auth;

const connect = (opt) => {
    if (!opt.username) return returnError("Username is required");
    if (!versions.includes(opt.version)) return returnError("Incorrect version");
    if (!opt.host) return returnError("IP is required");
    //if(opt.host == "localhost") return returnError("localhost is not allowed, use public IP");
    if (!opt.port) opt.port = "25565";
    if (!opt.auth && opt.username) auth = "offline"
    
    const spawnedBot = mc.createClient(opt)

    spawnedBot.on("connect", () => {
        bot.emit("connect");

        loadHealth(bot, spawnedBot, opt.socket);
        loadChat(bot, spawnedBot);
        loadInventory(spawnedBot, bot, opt.version);

        readdir("./bot/functions", (err, files) => {
            if (err) throw err;
        
            const functionNames = files
                .filter(file => file.endsWith(".js"))
                .map(file => file.replace(".js", ""));
        
            const loaded = new Set();
        
            functionNames.forEach(fn => {
                const eventName = `loaded_${fn}`;
                bot.once(eventName, () => {
                    console.log("Loaded", fn, "functionality");
                    loaded.add(fn);
        
                    if (loaded.size === functionNames.length) {
                        console.log("All functionality loaded. Emitting spawn...");
                        bot.emit("spawn");
                    }
                });
            });
        });
    });

    bot.client = spawnedBot
    bot.on("spawn", () => console.log("spawned"))
    spawnedBot.on("connect", () => {
        bot.emit("connect")
    });

    bot.on("death", () => respawn(bot))
    bot.disconnect = function (reason) {
        spawnedBot.end(reason ? reason : null)
        bot.emit("disconnect", reason)
    }

    return bot;
}

const respawn = (bot) => {
    if (bot.health > 0) return;
    bot.client.write('client_command', { payload: 0 })
    bot.emit("respawn");
}
const returnError = (err) => {
    if (!err) return bot.emit("error", "No error specified, something went wrong")
    bot.emit("error", err)
}

module.exports = { connect }