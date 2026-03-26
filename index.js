const { Telegraf } = require('telegraf');
const OpenAI = require("openai");
const fs = require("fs");

// TOKENS (Railway env use karo)
const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ADMIN ID
const ADMIN_ID = 7921480123;

// USER DATA (AI earning system)
let users = {};

function generateOrderId() {
  return Math.floor(100000 + Math.random() * 900000);
}

// START
bot.start((ctx) => {
  const user = ctx.from;

  const userData = `${user.id},${user.username},${user.first_name}\n`;
  fs.appendFileSync("users.txt", userData);

  if (!users[user.id]) {
    users[user.id] = { count: 0, paid: false };
  }

  ctx.telegram.sendMessage(ADMIN_ID,
    `New User Joined:\nID: ${user.id}\nUsername: @${user.username}`
  );

  ctx.reply(
    "👋 Welcome to Neha Roy Paid Services\n\n🤖 AI Chat Available (5 free msgs)\n💰 After that ₹49\n\nChoose option:",
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🛒 View Services", callback_data: "services" }],
          [{ text: "🤖 AI Chat", callback_data: "ai_chat" }],
          [{ text: "📞 Contact", callback_data: "contact" }],
          [{ text: "💰 Payment Info", callback_data: "payment" }]
        ]
      }
    }
  );
});

// AI BUTTON
bot.action("ai_chat", (ctx) => {
  ctx.reply("🤖 AI Mode ON\n\nKuch bhi pucho...");
});

// SERVICES
bot.action('services', (ctx) => {
  ctx.editMessageText("📋 Available Services:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "1 Hour video call ₹350", callback_data: "buy_1" }],
        [{ text: "1 hour sx chat ₹150", callback_data: "buy_2" }],
        [{ text: "N*de photos ₹50", callback_data: "buy_3" }],
        [{ text: "⬅ Back", callback_data: "menu" }]
      ]
    }
  });
});

// BUY
bot.action(/buy_(.+)/, (ctx) => {
  const orderId = generateOrderId();

  ctx.reply(`🧾 Order Created

🆔 Order ID: #${orderId}

💰 Payment Details
UPI: dipika.bharti@ptyes
Name: Dipika Bharti

1️⃣ Payment karo
2️⃣ Screenshot bhejo
3️⃣ Admin verify karegi

🙏 Thanks`);
});

// CONTACT
bot.action('contact', (ctx) => {
  ctx.editMessageText("📞 Contact:\nInstagram: @neharoyyxx", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔙 Back", callback_data: "menu" }]
      ]
    }
  });
});

// PAYMENT
bot.action('payment', async (ctx) => {
  await ctx.replyWithPhoto(
    { source: './IMG_20260317_180557_447.jpg' },
    {
      caption: `💳 Payment

UPI: dipika.bharti@ptyes

Screenshot bhejo after payment`
    }
  );
});

// MENU
bot.action('menu', (ctx) => {
  ctx.editMessageText("🏠 Main Menu", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📋 View Services", callback_data: "services" }],
        [{ text: "🤖 AI Chat", callback_data: "ai_chat" }],
        [{ text: "📞 Contact", callback_data: "contact" }],
        [{ text: "💰 Payment Info", callback_data: "payment" }]
      ]
    }
  });
});

// SCREENSHOT → ADMIN
bot.on("photo", (ctx) => {
  ctx.forwardMessage(ADMIN_ID);
  ctx.reply("✅ Screenshot admin ko bhej diya gaya.");
});

// ADMIN APPROVE (AI unlock)
bot.command("approve", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;

  const userId = ctx.message.text.split(" ")[1];

  if (users[userId]) {
    users[userId].paid = true;
    ctx.telegram.sendMessage(userId, "✅ AI Unlocked 🎉");
    ctx.reply("User approved");
  }
});

// 🤖 AI MESSAGE HANDLER
bot.on("text", async (ctx) => {
  const id = ctx.from.id;
  const text = ctx.message.text;

  if (text.startsWith("/")) return;

  if (!users[id]) users[id] = { count: 0, paid: false };

  // LIMIT
  if (users[id].count >= 5 && !users[id].paid) {
    return ctx.reply("❌ Free limit khatam\n₹49 pay karo AI unlock ke liye");
  }

  users[id].count++;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: text }],
    });

    ctx.reply(res.choices[0].message.content);
  } catch (err) {
    console.log(err);
    ctx.reply("⚠️ Error");
  }
});

bot.launch();
console.log("Bot Running...");
