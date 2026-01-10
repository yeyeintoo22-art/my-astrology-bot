const { Telegraf } = require('telegraf');
const http = require('http');

// 1. Render အတွက် Web Server အပိုင်း
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is alive!');
}).listen(port);

// 2. Bot အပိုင်း (Token ကို Environment Variable ကနေ ယူမယ်)
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome! Your bot is running 24/7 on Render.'));
bot.help((ctx) => ctx.reply('Send me a message!'));
bot.on('text', (ctx) => ctx.reply(You said: ${ctx.message.text}));

bot.launch();

console.log("Bot is starting...");
