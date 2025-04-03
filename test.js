const {connect} = require("./bot/bot");

const bot = connect({
    username: "yayyy",
    version: "1.21.1",
    host: "localhost"
})

bot.on("chat", (author, msg) => {
    console.log(bot)
    if(msg.includes("disconnect")) bot.disconnect(msg.split("disconnect")[1])
    if(msg.includes("name")) console.log(bot.username)
})

bot.on("disconnect", (reason)=> console.log("disconnected", reason))
bot.on("error", e => {
    console.log(e)
})
//la