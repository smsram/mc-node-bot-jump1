// Remove all listeners for warning events to suppress deprecation warnings
process.removeAllListeners('warning'); 

const mineflayer = require('mineflayer');

let bot; // Global bot instance
let reconnecting = false; // To prevent multiple reconnect attempts

// Function to create the bot
function createBot() {
  bot = mineflayer.createBot({
    host: 'smsram.aternos.me', // Replace with your Aternos server IP
    port: 48121,               // Use your specific port
    username: `Bot_Gadu_${Math.floor(Math.random() * 10000)}`,      // Random username
    version: '1.21.4',         // Specify the exact version of the server
    auth: 'offline',           // Use offline auth for cracked servers
  });

  bot.on('spawn', () => {
    console.log(`[${new Date().toISOString()}] Bot has spawned!`);

    // Make the bot jump every 1 minute
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
        console.log(`[${new Date().toISOString()}] Bot performed a jump.`);
      }, 500); // Jump for 500ms
    }, 60000); // Jump every 1 minute (60000ms)
  });

  bot.on('kicked', (reason) => {
    console.error(`[${new Date().toISOString()}] Bot was kicked:`, reason);
    attemptReconnect(); // Attempt to reconnect on kick
  });

  bot.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Bot encountered an error:`, err);
  });

  bot.on('end', () => {
    console.log(`[${new Date().toISOString()}] Bot disconnected from the server.`);
    attemptReconnect(); // Attempt to reconnect on disconnect
  });

  // Safely handle undefined entities to avoid crashes
  bot._client.on('entity_attach', (packet) => {
    const vehicle = bot.entities[packet.vehicle];
    const passenger = bot.entities[packet.entity];
    if (vehicle && passenger) {
      vehicle.passengers = vehicle.passengers || [];
      vehicle.passengers.push(passenger);
    }
  });
}

// Function to attempt bot reconnection
function attemptReconnect() {
  if (reconnecting) return;
  reconnecting = true;

  console.log(`[${new Date().toISOString()}] Reconnecting bot...`);
  setTimeout(() => {
    reconnecting = false;
    createBot(); // Create a new bot instance to reconnect
  }, 5000); // Retry after 5 seconds
}

// Create the bot for the first time
createBot();
