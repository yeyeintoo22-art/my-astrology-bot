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

//bot.start((ctx) => ctx.reply('မင်္ဂလာပါ! ဗေဒင် Bot စတင်အလုပ်လုပ်နေပါပြီ။'));

const TelegramBot = require('node-telegram-bot-api');
const token = '8040160587:AAFOOF955wdafPXk-QFD4ApwVjhWKCQuS-0';

// ===== ALGORITHMS =====

function getLifeIndex(dob) {
  const [d, m, y] = dob.split('/').map(Number);
  const today = new Date();

  const sum =
    d +
    m +
    y +
    today.getDate() +
    (today.getMonth() + 1) +
    today.getFullYear();

  return sum % 10;
}

function moneyResult(index) {
  if (index >= 8) return '💰 ငွေကြေးကောင်းမွန် — ဝင်ငွေတိုးတက်နိုင်။';
  if (index >= 5) return '💰 ငွေဝင်ထွက်ညီ — စုဆောင်းသင့်။';
  if (index >= 3) return '💰 ငွေကြေးတင်းကြပ် — အလွယ်သုံးရှောင်။';
  return '💰 ငွေကြေးအခက်အခဲ — အကြွေး၊ ထီရှောင်။';
}

function jobResult(index) {
  if (index >= 8) return '💼 အလုပ်အကိုင်တိုးတက် — အခွင့်အရေးသစ်ရနိုင်။';
  if (index >= 5) return '💼 အလုပ်တည်ငြိမ် — လက်ရှိကို အာရုံစိုက်။';
  if (index >= 3) return '💼 အလုပ်အခက်အခဲ — စကားပဋိပက္ခရှောင်။';
  return '💼 အလုပ်အဆင်မပြေ — အလုပ်ပြောင်းမသင့်သေး။';
}

function examResult(index) {
  if (index >= 8) return '📚 စာမေးပွဲအောင်မြင်နိုင်ချေ မြင့်။';
  if (index >= 5) return '📚 အောင်နိုင်ချေရှိ — အချိန်စီမံခန့်ခွဲ။';
  if (index >= 3) return '📚 အခက်အခဲရှိ — ပြန်လေ့လာရန်လို။';
  return '📚 မသေချာ — အရေးကြီးမေးခွန်းလွတ်နိုင်။';
}

// ❤️ အချစ်ရေး Algorithm (NEW)
function loveResult(index) {
  if (index >= 8) return '❤️ အချစ်ရေးကောင်းမွန် — နားလည်မှုတိုးတက်။';
  if (index >= 5) return '❤️ အချစ်ရေးတည်ငြိမ် — စကားပြောဆိုမှုက အဓိက။';
  if (index >= 3) return '❤️ အချစ်ရေးအနည်းငယ်အခက် — မနာလိုမှုရှောင်။';
  return '❤️ အချစ်ရေးမတည်ငြိမ် — အရေးကြီးဆုံးက စိတ်ရှည်ခြင်း။';
}

function getLuckyNumber(dob) {
  const parts = dob.split('/');
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[2]);

  const sum = day + month + year;
  return sum % 9 || 9;
}

const users = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  users[chatId] = { step: 1 };

  bot.sendMessage(
    chatId,
    'မင်္ဂလာပါ 🙏\n Astro By Sayar Ye Botမှ ကြိုဆိုပါတယ်\nမွေးသက္ကရာဇ်ကို 01/01/2000 ပုံစံနဲ့ ထည့်ပါ'
  );
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!users[chatId] || text === '/start') return;

  // STEP 1: DOB
  if (users[chatId].step === 1) {
    users[chatId].dob = text;
    users[chatId].step = 2;

    bot.sendMessage(chatId, 'ဘာနေ့သား/သမီး ဖြစ်ပါသလဲ?', {
      reply_markup: {
        keyboard: [
          ['တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး'],
          ['ကြာသပတေး', 'သောကြာ', 'စနေ', 'တနင်္ဂနွေ']
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  // STEP 2: Day
  if (users[chatId].step === 2) {
    users[chatId].day = text;
    users[chatId].step = 3;

    bot.sendMessage(chatId, 'ဘာအကြောင်း သိချင်ပါသလဲ?', {
      reply_markup: {
        keyboard: [
          ['💰 ငွေကြေး'],
          ['💼 အလုပ်အကိုင်'],
	  ['📚 စာမေးပွဲ'],
          ['❤️ အချစ်ရေး']
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
    return;
  }

  // STEP 3: Topic
  if (users[chatId].step === 3) {
  let reply = '';
  const index = getLifeIndex(users[chatId].dob);

  if (text.includes('ငွေ')) {
    reply = moneyResult(index);
  } else if (text.includes('အလုပ်')) {
    reply = jobResult(index);
  } else if (text.includes('စာ')) {
    reply = examResult(index);
  } else if (text.includes('အချစ်')) {
    reply = loveResult(index);
  } else {
    reply = 'မေးခွန်းကို ပြန်ရွေးပေးပါ 🙏';
  }

  reply += `\n\n🔢 Life Index: ${index}`;

  bot.sendMessage(chatId, reply, {
    reply_markup: { remove_keyboard: true }
  });

  users[chatId].step = 0;
}
});

bot.on('text', (ctx) => {
  const userMsg = ctx.message.text;
  ctx.reply(`သင်ပြောလိုက်တာကတော့ - ${userMsg}`);
});

bot.launch();

console.log("Bot is successfully started...");



