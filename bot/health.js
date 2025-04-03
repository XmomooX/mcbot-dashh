const loadHealth = (bot, spawnedbot)=>{
    spawnedbot.once("update_health", (p) => {
        if (p.health > 0) {
            bot.client.health = p.health;
            bot.client.food = p.food
            bot.emit("spawn")
        }
    })
    spawnedbot.on("update_health", (p) => {
        console.log("fired")
        bot.client.health = p.health;
        bot.client.food = p.food

        if (p.health <= 0) {
            bot.emit("death")
        }
    })
}

module.exports = { loadHealth }