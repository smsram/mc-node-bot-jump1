const mineflayer = require('mineflayer');

let bot;
let reconnecting = false;

function createBot() {
  bot = mineflayer.createBot({
    host: 'smsram.aternos.me',
    port: 48121,
    username: 'bot_gadu',
    version: '1.21.4',
    auth: 'offline',
  });

  bot.on('spawn', () => {
    console.log('Bot has spawned!');
    setTimeout(startRandomMovement, 5000);
  });

  bot.on('error', (err) => {
    console.error('Bot error:', err);
  });

  bot.on('kicked', (reason) => {
    console.error('Bot was kicked:', reason);
    attemptReconnect();
  });

  bot.on('end', () => {
    console.log('Bot disconnected.');
    attemptReconnect();
  });

  // ✅ Prevent crashes caused by missing vehicle data
  bot.on('entityAttach', (entity, vehicle) => {
    if (!vehicle) {
      console.warn('⚠️ Warning: Vehicle is undefined, ignoring attachment.');
      return;
    }
  });
}

// Safe movement function
function startRandomMovement() {
  if (!bot || !bot.entity) return;

  setInterval(() => {
    const actions = ['forward', 'back', 'left', 'right'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    bot.clearControlStates();
    bot.setControlState(randomAction, true);

    setTimeout(() => bot.setControlState(randomAction, false), 500);
  }, 3000);
}

// Reconnection function
function attemptReconnect() {
  if (reconnecting) return;
  reconnecting = true;

  console.log('Reconnecting bot...');
  setTimeout(() => {
    reconnecting = false;
    createBot();
  }, 10000);
}

// Start bot
createBot();
