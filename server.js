const express = require("express");
const app = express();
const { startBot, stopBot, botInfo, botStatus } = require("./app");
const socketIo = require('socket.io');
const http = require('http');
const cors = require("cors");

const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.set("view engine", "ejs");
app.set("views", __dirname + '/views');
app.use(express.static(__dirname + '/views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let botInitialized = false;
let bot = null;
let botChatListenerAdded = false; // Add this flag

io.on('connection', (socket) => {
    socket.on('send', (msgg) => {
        console.log("Received message:", msgg);
        if (bot) {
            bot.sendMessage(msgg);
        }
    });

    socket.on('disconnect', () => {
        console.log('chat socket disconnected');
    });

    if(bot && !botChatListenerAdded){ 
        bot.on("chat", (author, msg) => {
            if (author == bot.client.username) return
            console.log(author, msg);
            io.emit('message', { author, content: msg });
        });
        botChatListenerAdded = true; 
    }

});

app.get("/dashboard", async (req, res) => {
    if (!botInitialized) {
        return res.render("loading", { message: "Bot is initializing, please wait..." });
    }

    try {
        if (!bot) { 
            bot = await botInfo();
        }

        const info = {
            "username": bot.client.username,
            "health": bot.client.health,
            "food": bot.client.food,
            "position": bot.client.position,
            "inv": bot.inventory.items
        }

        res.json({ info: JSON.stringify(info), message: "Bot is ready!", author: bot.client.username });
    } catch (error) {
        console.log("Error fetching bot info:", error);
        res.redirect("/");
    }
});

app.post("/startbot", async (req, res) => {
    if (!botInitialized) {
        startBot("yeye", "localhost", "25565", "1.21.1", res).then(() => {
            botInitialized = true;
        });
    }
});

app.post("/stopbot", async (req, res) => {
    await stopBot();
    botInitialized = false;
    bot = null; 
    botChatListenerAdded = false; 
    res.redirect("/");
});

server.listen(4000, () => {
    console.log(`Socket server is running on port 4000`);
});

module.exports = app;