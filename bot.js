const mineflayer = require('mineflayer');

let bot;
let moveInterval;
let isRunning = false;
let startTime;

// Time Config (in milliseconds)
const RUN_TIME = 1 * 60 * 60 * 1000; // 1 hour active
const REST_TIME = 1 * 60 * 60 * 1000; // 1 hour rest

// Start bot immediately
createBot();

function createBot() {
  if (isRunning) return; // Prevent multiple bots running at once

  console.log('🚀 Starting bot...');
  isRunning = true;
  startTime = Date.now(); // Mark the start time

  bot = mineflayer.createBot({
    host: 'smsram.aternos.me',
    port: 48121,
    username: 'bot_gadu',
    version: '1.21.4',
    auth: 'offline',
    viewDistance: 'tiny',
    disableChatSigning: true,
    physicsEnabled: false
  });

  bot.on('spawn', () => {
    console.log('✅ Bot has joined and will move for 1 hour.');
    startRandomMovement();
    setTimeout(stopBot, RUN_TIME); // Stop bot after 1 hour
  });

  bot.on('kicked', (reason) => {
    console.error(`⚠️ Bot was kicked: ${reason}`);
    if (shouldReconnect()) reconnectInstantly();
  });

  bot.on('end', () => {
    console.log('🔄 Bot disconnected.');
    if (shouldReconnect()) reconnectInstantly();
  });

  bot.on('error', (err) => {
    console.error('❌ Bot error:', err);
    if (shouldReconnect()) reconnectInstantly();
  });
}

// Bot movement function
function startRandomMovement() {
  if (!bot || !bot.entity) return;

  const actions = ['forward', 'back', 'left', 'right'];
  moveInterval = setInterval(() => {
    if (!bot || !bot.entity) return clearInterval(moveInterval);

    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    bot.clearControlStates();
    bot.setControlState(randomAction, true);
    setTimeout(() => bot.setControlState(randomAction, false), 200);
  }, 10000); // Moves every 10 seconds
}

// Stop bot after 1 hour and schedule rejoin
function stopBot() {
  console.log('🛑 Stopping bot for 1 hour...');
  clearInterval(moveInterval);
  isRunning = false;
  bot.end();
  setTimeout(createBot, REST_TIME); // Rejoin after 1 hour
}

// Check if bot should reconnect instantly
function shouldReconnect() {
  return isRunning && (Date.now() - startTime) < RUN_TIME; // Only reconnect if within the active time
}

// Reconnect instantly
function reconnectInstantly() {
  console.log('🔄 Reconnecting instantly...');
  if (!isRunning) {
    isRunning = true; // Make sure reconnect attempts don't interfere with another bot creation
    setTimeout(createBot, 5000); // Wait 5 seconds before reconnecting
  }
}
