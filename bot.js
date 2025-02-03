const mineflayer = require('mineflayer');

let bot;
let reconnectAttempts = 0;
let isRunning = false;
const MAX_RECONNECT_ATTEMPTS = 20; // Limit for initial connection attempts

// Time Config (in milliseconds)
const RUN_TIME = 1 * 60 * 60 * 1000; // 1 hour active
const REST_TIME = 1 * 60 * 60 * 1000; // 1 hour rest

// Start bot immediately
createBot();

function createBot() {
  if (isRunning) return; // Prevent multiple bots running at once
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.log('🚫 Max reconnection attempts reached! Waiting 1 hour before retrying.');
    scheduleReconnect();
    return;
  }

  console.log('🚀 Starting bot...');
  reconnectAttempts = 0; // Reset attempts after each new connection attempt
  isRunning = true; // Mark the bot as running

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
    console.log('✅ Bot has spawned!');
    startRandomMovement();
    setTimeout(stopBot, RUN_TIME); // Run for 1 hour before stopping
  });

  bot.on('kicked', (reason) => {
    console.error(`⚠️ Bot was kicked: ${reason}`);
    handleReconnection();
  });

  bot.on('end', () => {
    console.log('🔄 Bot disconnected.');
    handleReconnection();
  });

  bot.on('error', (err) => {
    console.error('❌ Bot error:', err);
    handleReconnection();
  });
}

// Optimized movement function
function startRandomMovement() {
  if (!bot || !bot.entity) return;

  const actions = ['forward', 'back', 'left', 'right'];
  let moveInterval = setInterval(() => {
    if (!bot || !bot.entity) {
      clearInterval(moveInterval);
      return;
    }

    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    bot.clearControlStates();
    bot.setControlState(randomAction, true);
    setTimeout(() => bot.setControlState(randomAction, false), 200);
  }, 10000); // Move every 10 seconds
}

// Stop bot after 1 hour
function stopBot() {
  console.log('🛑 Stopping bot for 1 hour...');
  bot.end();
  scheduleReconnect(); // Wait 1 hour before restarting
}

// Handle reconnections during the join period (within 1 hour)
function handleReconnection() {
  if (isRunning) {
    console.log('🔁 Reconnecting...'); 
    reconnectAttempts++;
    setTimeout(createBot, 60000); // Try reconnecting every 60 seconds
  } else {
    console.log('⏳ Waiting before retrying connection...');
    setTimeout(createBot, 5000); // Try reconnecting after 5 seconds if bot can't connect initially
  }
}

// Schedule next cycle after 1 hour of rest
function scheduleReconnect() {
  console.log(`⏳ Waiting ${REST_TIME / (60 * 60 * 1000)} hour before restarting...`);
  setTimeout(() => {
    reconnectAttempts = 0; // Reset reconnect attempts after rest period
    isRunning = false;
    createBot();
  }, REST_TIME); // Wait 1 hour before restarting the bot
}
