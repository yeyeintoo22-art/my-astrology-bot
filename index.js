const TelegramBot = require('node-telegram-bot-api');
const http = require('http');

// 1. Render Port Binding (ဒါပါမှ Live ဖြစ်မှာပါ)
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running!');
}).listen(port);

// 2. Bot Setup (Token ကို Environment Variable မှ ယူပါသည်)
const token = process.env.BOT_TOKEN || '8040160587:AAFOOF955wdafPXk-QFD4ApwVjhWKCQuS-0';
const bot = new TelegramBot(token, { polling: true });
const users = {};
const allUserIds = new Set(); // User ID အားလုံးကို မှတ်ရန်
const adminId = 6754962387;  // ဆရာကြီးရဲ့ ID

// ===== ALGORITHMS =====

function getLifeIndex(dob) {
  const parts = dob.split('/').map(Number);
  if (parts.length < 3) return 0;
  const [d, m, y] = parts;
  const today = new Date();
  const sum = d + m + y + today.getDate() + (today.getMonth() + 1) + today.getFullYear();
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

function loveResult(index) {
  if (index >= 8) return '❤️ အချစ်ရေးကောင်းမွန် — နားလည်မှုတိုးတက်။';
  if (index >= 5) return '❤️ အချစ်ရေးတည်ငြိမ် — စကားပြောဆိုမှုက အဓိက။';
  if (index >= 3) return '❤️ အချစ်ရေးအနည်းငယ်အခက် — မနာလိုမှုရှောင်။';
  return '❤️ အချစ်ရေးမတည်ငြိမ် — အရေးကြီးဆုံးက စိတ်ရှည်ခြင်း။';
}

// ===== BOT LOGIC =====
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  allUserIds.add(chatId); // <--- 
  users[chatId] = { step: 1 };
  if (chatId === adminId) {
    const count = allUserIds.size;
    bot.sendMessage(chatId, `📊 လက်ရှိ Bot ကို အသုံးပြုထားသူ စုစုပေါင်း: ${allUserIds.size} ယောက် ရှိပါတယ်ခင်ဗျာ။`);
  } else {
    console.log(`Unauthorized access attempt by: ${chatId}`);
  }
  bot.sendMessage(chatId, 'မင်္ဂလာပါ 🙏\nAstro By Sayar Ye Bot မှ ကြိုဆိုပါတယ်\nမွေးသက္ကရာဇ်ကို 01/01/2000 ပုံစံနဲ့ ထည့်ပါ');
});
  
  // STEP 1: DOB
  if (users[chatId].step === 1) {
    users[chatId].dob = text;
    users[chatId].step = 2;
    bot.sendMessage(chatId, 'ဘာနေ့သား/သမီး ဖြစ်ပါသလဲ?', {
      reply_markup: {
        keyboard: [['တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး'], ['ကြာသပတေး', 'သောကြာ', 'စနေ', 'တနင်္ဂနွေ']],
        resize_keyboard: true, one_time_keyboard: true
      }
    });
    return;
  }

  // STEP 2: Day
  if (users[chatId].step === 2) {
    users[chatId].day = text;
    users[chatId].step = 3;
    bot.sendMessage(chatId, chatId, {
      text: 'ဘာအကြောင်း သိချင်ပါသလဲ?',
      reply_markup: {
        keyboard: [['💰 ငွေကြေး'], ['💼 အလုပ်အကိုင်'], ['📚 စာမေးပွဲ'], ['❤️ အချစ်ရေး']],
        resize_keyboard: true, one_time_keyboard: true
      }
    });
    return;
  }

  // STEP 3: Topic & Final Result
  if (users[chatId].step === 3) {
    const index = getLifeIndex(users[chatId].dob);
    let result = '';

    if (text.includes('ငွေ')) result = moneyResult(index);
    else if (text.includes('အလုပ်')) result = jobResult(index);
    else if (text.includes('စာ')) result = examResult(index);
    else if (text.includes('အချစ်')) result = loveResult(index);
    else result = 'မေးခွန်းကို ပြန်ရွေးပေးပါ 🙏';

    const finalReply = `${result}\n\n🔢 Life Index: ${index}
    \n\nပိုမိုသိရှိလိုပါက ဤနေရာ https://t.me/AstroBySayarYe မှ ဝင်ရောက်လေ့လာနိုင်ပါသည်
    \n\nSystem မှ ဝင်လာတတ်သော ကြော်ငြာများကိုလည်း မဝင်ရောက်မိရန်သတိထားပါ
    \n\nအသုံးပြုမှုအတွက် ကျေးဇူးတင်ပါသည်🙏
    \n\nထပ်မံအသုံးပြုရန် /start ကိုနှိပ်ပါ`;
    bot.sendMessage(chatId, finalReply, { reply_markup: { remove_keyboard: true } });
    users[chatId].step = 0;
  }
});

console.log("Bot is starting successfully...");















