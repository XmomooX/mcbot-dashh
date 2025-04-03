const { EventEmitter } = require("events");
const mc = require("minecraft-protocol");
const versions = require("./versions");
const { loadHealth } = require("./health");
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

    bot.client = spawnedBot

    spawnedBot.on("connect", () => {
        bot.emit("connect")
    });
    loadHealth(bot, spawnedBot)
    

    spawnedBot.on("playerChat", (data) => {
        bot.emit("chat", data.senderName.split("\"")[1], data.formattedMessage.split("\"")[1])
    })
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