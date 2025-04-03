const express = require("express");
const app = express();
const { startBot, stopBot, botInfo, botStatus } = require("./app");
const socketIo = require('socket.io');
const http = require('http');

const server = http.createServer(app);
const io = socketIo(server);

app.set("view engine", "ejs");
app.set("views", __dirname + '/views');
app.use(express.static(__dirname + '/views'));
let botInitialized = false;
let bot = null;  
let activeSocket = null;  

io.on('connection', (socket) => {
    console.log('chat socket connected');
    
    if (activeSocket) {
        socket.emit('error', 'Only one connection is allowed at a time');
        socket.disconnect();
        console.log('New socket connection rejected. Only one connection is allowed at a time.');
        return;
    }

    activeSocket = socket;  
    socket.on('send', (msgg) => {
        console.log("Received message:", msgg);
        if (bot) {
            bot.sendMessage(msgg);  
         }
    });

    socket.on('disconnect', () => {
        console.log('chat socket disconnected');
        activeSocket = null;  
        });
});

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/dashboard", async (req, res) => {
    if (!botInitialized) {
        return res.render("loading", { message: "Bot is initializing, please wait..." });
    }

    try {
        bot = await botInfo(); 
        //console.log(bot) 
        bot.on("chat", (author, msg) => {
            console.log(author, msg);
            if (activeSocket) {
                activeSocket.emit('message', { author, content: msg });
            }
        });

        
        const info = {
            "username": bot.client.username,
            "health": bot.client.health,
            "food": bot.client.food,
            "position": bot.client.position,
        }

        res.render("dashboard", { info: JSON.stringify(info), message: "Bot is ready!", author: bot.username });
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
    res.redirect("/");
});

server.listen(3000, () => {
    console.log(`Socket server is running on port 3000`);
});

module.exports = app;
