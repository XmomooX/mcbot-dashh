const loadChat = (bot, spawnedBot) => {
    spawnedBot.on("playerChat", (data) => {
        let sender;
        let msg;
        if(JSON.parse(data.senderName).text) {
            sender = JSON.parse(data.senderName).text
            msg = data.plainMessage;
        } else {
            sender = data.senderName.split("\"")[1]
            msg = data.formattedMessage.split("\"")[1]
        }
        bot.emit("chat", sender , msg)
    })

    bot.sendMessage = (message) => {
        bot.client.chat(message)
    }
}
module.exports = {
    loadChat
}