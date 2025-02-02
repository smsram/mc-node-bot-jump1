const mineflayer = require('mineflayer');

let bot;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 20; // Maximum retries within 4 hours

// Time Config (in milliseconds)
const RUN_TIME = 2 * 60 * 60 * 1000; // 2 hours
const DELAY_TIME = 2 * 60 * 60 * 1000; // 2 hours

// Start by running the bot immediately
createBot();

function createBot() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.log('🚫 Max reconnection attempts reached! Waiting 4 hours before restarting.');
    scheduleReconnect();
    return;
  }

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
    reconnectAttempts = 0; // Reset reconnection count on successful join
    startRandomMovement();
    setTimeout(stopBot, RUN_TIME); // Run for 4 hours before stopping
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

// Stop bot after 4 hours
function stopBot() {
  console.log('🛑 Stopping bot for 4 hours...');
  bot.end();
  scheduleReconnect(); // Wait 4 hours before restarting
}

// Handle reconnections within 4 hours
function handleReconnection() {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.log('🚫 Max reconnection attempts reached! Waiting for next cycle.');
    scheduleReconnect();
    return;
  }

  reconnectAttempts++;
  console.log(`🔁 Reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}...`);
  setTimeout(createBot, 60000); // Try reconnecting every 60 seconds
}

// Schedule next cycle after 4-hour wait
function scheduleReconnect() {
  console.log(`⏳ Waiting ${DELAY_TIME / (60 * 60 * 1000)} hours before restarting...`);
  setTimeout(() => {
    reconnectAttempts = 0;
    createBot();
  }, DELAY_TIME);
}
