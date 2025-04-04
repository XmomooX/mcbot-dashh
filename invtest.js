const mc = require('minecraft-protocol');
const { Window } = require('prismarine-windows')("1.21.1")

const bot = mc.createClient({
    username: "ppp",
    host: 'localhost', 
    port: 25565,        
});

let inventoryWindow = new Window(0, 'minecraft:inventory', 46, null); // 46 slots for player inventory

bot.on('window_items', (packet) => {
    if (packet.windowId === 0) { 
        inventoryWindow.updateSlot(1, packet.items);
        console.log("Inventory Updated:", inventoryWindow.slots);
    }
});

bot.on('set_slot', (packet) => {
    if (packet.windowId === 0) { 
        inventoryWindow.updateSlot(packet.slot, packet.item);
        console.log(`Slot ${packet.slot} updated:`, inventoryWindow.slots[packet.slot]);
    }
});

bot.on('chat', (packet) => {
    const message = packet.message.toLowerCase();
    if (message === "!inv") {
        console.log("Current Inventory:");
        inventoryWindow.slots.forEach((item, index) => {
            if (item) console.log(`Slot ${index}: ${JSON.stringify(item)}`);
        });
    }
});

bot.on('login', () => {
    console.log("Bot logged in! Waiting for inventory updates...");
});
