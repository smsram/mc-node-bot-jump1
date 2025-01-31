const mineflayer = require('mineflayer');

let bot;
let reconnecting = false;
let useUpperCaseBot = true; // Toggle between 'Bot_Gadu' and 'bot_gadu'

function createBot() {
  const botName = useUpperCaseBot ? 'Bot_Gadu' : 'bot_gadu';
  console.log(`Starting bot with username: ${botName}`);

  bot = mineflayer.createBot({
    host: 'smsram.aternos.me',
    port: 48121,
    username: botName,
    version: '1.21.4',
    auth: 'offline',
  });

  bot.on('spawn', () => {
    console.log(`${botName} has spawned!`);
    setTimeout(startRandomMovement, 5000);
    scheduleBotSwitch(); // Schedule the next switch
  });

  bot.on('error', (err) => {
    console.error('Bot error:', err);
  });

  bot.on('kicked', (reason) => {
    console.error('Bot was kicked:', reason);
    attemptReconnect();
  });

  bot.on('end', () => {
    console.log(`${botName} disconnected.`);
    attemptReconnect();
  });

  bot.on('entityAttach', (entity, vehicle) => {
    if (!vehicle) {
      console.warn('⚠️ Warning: Vehicle is undefined, ignoring attachment.');
      return;
    }
  });
}

// Schedule bot switch every 4 hours
function scheduleBotSwitch() {
  setTimeout(() => {
    console.log('Switching bot usernames...');
    bot.end(); // Disconnect current bot
    useUpperCaseBot = !useUpperCaseBot; // Toggle username
    createBot(); // Start new bot
  }, 4 * 60 * 60 * 1000); // 4 hours in milliseconds
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
