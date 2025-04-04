const {connect} = require("./bot/bot");

const bot = connect({
    username: "yaeyyy",
    version: "1.21.1",
    host: "localhost"
})

bot.on("spawn", () => {
    //console.log("d", bot.inventory.items, bot.client.username, bot.client.health, bot.client.food)
})

bot.on("chat", (author, msg) => {
    console.log(msg)
    if(msg.includes("health")) console.log(bot.client.health, bot.client.food)
    if(msg.includes("disconnect")) bot.disconnect(msg.split("disconnect")[1])
    if(msg.includes("name")) console.log(bot.username)
})

bot.on("disconnect", (reason)=> console.log("disconnected", reason))
bot.on("error", e => {
    console.log(e)
})
