const mineflayer = require('mineflayer');

let bot;
let moveInterval;
let isRunning = false;
let startTime;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10; // Maximum attempts to reconnect
const RECONNECT_DELAY = 10000; // Delay in ms for reconnect attempts (increased to 10 seconds)

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
    handleReconnection();
  });

  bot.on('end', () => {
    console.log('🔄 Bot disconnected.');
    handleReconnection();
  });

  bot.on('error', (err) => {
    console.error('❌ Bot error:', err);
    if (err.code === 'ECONNRESET') {
      console.error('⚠️ Connection was reset. Retrying...');
    }
    handleReconnection();
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

// Handle reconnection attempts
function handleReconnection() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.log('🚫 Max reconnection attempts reached! Waiting before retrying.');
    reconnectAttempts = 0; // Reset attempt counter after waiting period
    setTimeout(createBot, REST_TIME); // Wait for 1 hour before retrying
  } else {
    reconnectAttempts++;
    console.log(`🔄 Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
    setTimeout(createBot, RECONNECT_DELAY); // Retry after 10 seconds (increased delay)
  }
}

// Check if bot should reconnect instantly
function shouldReconnect() {
  return isRunning && (Date.now() - startTime) < RUN_TIME;
}
