const { loadChat } = require("../chat");

const loadHealth = (bot, spawnedbot, socket)=>{
    spawnedbot.once("update_health", (p) => {
        if (p.health > 0) {
            bot.client.health = p.health;
            bot.client.food = p.food
            bot.emit("loaded_health")
        }
    })
    spawnedbot.on("update_health", (p) => {
        console.log("fired", p.health)
        socket.emit("health", Math.floor(p.health))
        socket.emit("food", Math.floor(p.food))
        bot.client.health = p.health;
        bot.client.food = p.food

        if (p.health <= 0) {
            bot.emit("death")
        }
    })
}

module.exports = { loadHealth }