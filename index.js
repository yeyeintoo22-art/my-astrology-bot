const { Telegraf } = require('telegraf');
const http = require('http');

// Render အတွက် Port ဖွင့်ခြင်း
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running!');
}).listen(port);

// Bot ဆောက်ခြင်း (Environment Variable ထဲက Token ကို ယူသုံးမည်)
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('မင်္ဂလာပါ! ဗေဒင် Bot စတင်အလုပ်လုပ်နေပါပြီ။'));

bot.on('text', (ctx) => {
  const userMsg = ctx.message.text;
  ctx.reply(`သင်ပြောလိုက်တာကတော့ - ${userMsg}`);
});

bot.launch();

console.log("Bot is successfully started...");

