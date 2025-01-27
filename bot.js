const mineflayer = require('mineflayer');

// Function to create the bot instance
function createBot() {
  const bot = mineflayer.createBot({
    host: 'smsram001-HpPI.aternos.me', // Replace with your Aternos server IP
    port: 48121,                      // Use your specific port
    username: 'BotName',              // Bot username
    version: '1.21.4',                // PaperMC version
  });

  bot.on('spawn', () => {
    console.log('Bot has spawned!');

    // Start moving forward and jumping continuously
    bot.setControlState('forward', true);
    bot.setControlState('jump', true);

    console.log('Bot is now always moving.');
  });

  // Handle disconnection and errors
  bot.on('kicked', (reason) => {
    console.error('Bot was kicked:', reason);
  });

  bot.on('error', (err) => {
    console.error('Bot encountered an error:', err);
  });

  bot.on('end', () => {
    console.log('Bot disconnected from the server.');
    reconnectBot(); // Recreate the bot after disconnection
  });
}

// Function to recreate the bot after disconnection
function reconnectBot() {
  console.log('Reconnecting bot...');
  setTimeout(() => {
    createBot(); // Recreate the bot instance
  }, 5000); // Retry after 5 seconds
}

// Create the bot for the first time
// createBot();


// const mineflayer = require('mineflayer');

// const bot = mineflayer.createBot({
//   host: 'smsram001-HpPI.aternos.me', // Replace with your Aternos server IP
//   port: 48121,                      // Use your specific port
//   username: 'Server Bot',              // Bot username
//   version: '1.21.4',                // Specify the exact version of the server
// });

// bot.on('spawn', () => {
//   console.log('Bot has spawned!');

//   // Start moving forward and jumping.
//   bot.setControlState('forward', true);
//   bot.setControlState('jump', true);

//   // Stop actions after 10 seconds.
//   setTimeout(() => {
//     bot.setControlState('forward', false);
//     bot.setControlState('jump', false);
//     console.log('Bot stopped moving.');
//   }, 10000);
// });

// // Handle disconnection and errors.
// bot.on('kicked', (reason) => {
//   console.error('Bot was kicked:', reason);
// });
// bot.on('error', (err) => {
//   console.error('Bot encountered an error:', err);
// });
// bot.on('end', () => {
//   console.log('Bot disconnected from the server.');
//   reconnectBot(); // Attempt to reconnect
// });

// // Function to reconnect the bot
// function reconnectBot() {
//   console.log('Reconnecting bot...');
//   setTimeout(() => {
//     bot.connect();
//   }, 5000); // Retry after 5 seconds
// }
