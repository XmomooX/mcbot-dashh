const prismarineWindows = require('prismarine-windows');
const prismarineRegistry = require('prismarine-registry');
const prismarineItem = require("prismarine-item");

const loadInventory = (bot, mainbot, version) => {
    const registry = prismarineRegistry(version);
    if (!registry) {
        console.error(`Invalid Minecraft version: ${version}`);
        return;
    }

    const { Window } = prismarineWindows(registry);


    let inventoryWindow = new Window(0, 'minecraft:inventory', 46, null); // 46 slots for player inventory

    bot.on('window_items', (packet) => {
        if (packet.windowId === 0) {
            inventoryWindow.updateSlot(1, packet.items);
            const formattedInv = formatInv(inventoryWindow, registry)
            mainbot.inventory = inventoryWindow;
            mainbot.inventory.items = formattedInv
            mainbot.emit("loaded_inventory")
        }
    });

    bot.on('set_slot', (packet) => {
        if (packet.windowId === 0) {
            console.log(packet.item)
            
            updateInv(mainbot, packet.item, packet.slot, registry)
        }
    });
    console.log(bot.inventory)
};

const formatInv = (inv, registery) => {
    const Item = prismarineItem(registery)
    const data = {}
    inv.slots.forEach((items) => {
        for (i in items) {
            if (items[i].itemCount > 0) {
                const item = new Item(items[i].itemId)
                data[i] = {
                    name: item.name,
                    count: items[i].itemCount,
                    slot: i
                }
            }
        }
    });
    console.log(data)
    return data;
}

const updateInv = (mainbot, item, slot, registery) => {
    const Item = prismarineItem(registery)
    const newItem = new Item(item.itemId);

    mainbot.inventory.items[slot] = {
        name: newItem.name,
        count: item.itemCount,
        slot: slot
    }
    return mainbot.inventory.items
}

module.exports = {
    loadInventory
};
