const { Telegraf, Markup } = require('telegraf');
const fs = require("fs");

// TOKEN
const bot = new Telegraf("8491538069:AAFn0NJV78rG4RZ9u3v5pttvVuCzTM6MmV0");

// ADMIN
const ADMIN_ID = 7921480123;

// ===== USER DB =====
let users = {};
if (fs.existsSync("users.json")) {
  users = JSON.parse(fs.readFileSync("users.json"));
}

function saveUsers() {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

// ===== ORDER ID =====
function generateOrderId() {
  return Math.floor(100000 + Math.random() * 900000);
}

// ===== START =====
bot.start((ctx) => {
  const user = ctx.from;

  // save user
  users[user.id] = { premium: false };
  saveUsers();

  // notify admin
  ctx.telegram.sendMessage(ADMIN_ID,
    `👤 New User\nID: ${user.id}\nUsername: @${user.username}`
  );

  ctx.replyWithPhoto(
    { source: './IMG_20260317_180557_447.jpg' },
    {
      caption: `
💎 NEHA ROY PREMIUM SERVICES

🔥 High Quality Private Services Available

💰 Affordable Prices
⚡ Instant Delivery
🔒 100% Private

👇 Choose option:
      `,
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🛒 View Services", "services")],
        [Markup.button.callback("💰 Payment Info", "payment")],
        [Markup.button.callback("📞 Contact", "contact")]
      ])
    }
  );
});

// ===== SERVICES =====
bot.action('services', (ctx) => {
  ctx.editMessageCaption(`📋 Available Services:

1️⃣ 1 Hour Video Call – ₹350  
2️⃣ 1 Hour Chat – ₹150  
3️⃣ Photos – ₹50  

👇 Select service:`, {
    ...Markup.inlineKeyboard([
      [Markup.button.callback("Buy Video Call", "buy_1")],
      [Markup.button.callback("Buy Chat", "buy_2")],
      [Markup.button.callback("Buy Photos", "buy_3")],
      [Markup.button.callback("⬅ Back", "menu")]
    ])
  });
});

// ===== BUY =====
bot.action(/buy_(.+)/, (ctx) => {
  const orderId = generateOrderId();

  ctx.reply(`
🧾 Order Created

🆔 Order ID: #${orderId}

💳 Payment Details:
UPI: dipika.bharti@ptyes
Name: Dipika Bharti

1️⃣ UPI se payment karo  
2️⃣ Screenshot bhejo  
3️⃣ 2 min me service milegi  

🙏 Thanks for choosing us
  `);
});

// ===== PAYMENT =====
bot.action('payment', async (ctx) => {
  ctx.replyWithPhoto(
    { source: './IMG_20260317_180557_447.jpg' },
    {
      caption: `
💳 Payment Info

UPI: dipika.bharti@ptyes
Name: Dipika Bharti

✔ Payment karo  
✔ Screenshot bhejo  
✔ Instant service milegi
      `
    }
  );
});

// ===== CONTACT =====
bot.action('contact', (ctx) => {
  ctx.editMessageCaption(`
📞 Contact Info:

Instagram: @neharoyyxx  
WhatsApp: Not Available
  `, {
    ...Markup.inlineKeyboard([
      [Markup.button.callback("⬅ Back", "menu")]
    ])
  });
});

// ===== MENU =====
bot.action('menu', (ctx) => {
  ctx.editMessageCaption("🏠 Main Menu", {
    ...Markup.inlineKeyboard([
      [Markup.button.callback("🛒 View Services", "services")],
      [Markup.button.callback("💰 Payment Info", "payment")],
      [Markup.button.callback("📞 Contact", "contact")]
    ])
  });
});

// ===== SCREENSHOT =====
bot.on("photo", (ctx) => {
  const userId = ctx.from.id;

  ctx.forwardMessage(ADMIN_ID);

  ctx.reply("✅ Screenshot admin ko bhej diya gaya.\nWait for verification...");

  bot.telegram.sendMessage(ADMIN_ID, `📩 Payment from user: ${userId}`);
});

// ===== ADMIN APPROVE =====
bot.command("approve", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;

  const userId = ctx.message.text.split(" ")[1];
  if (!userId) return ctx.reply("Use: /approve USER_ID");

  users[userId] = { premium: true };
  saveUsers();

  bot.telegram.sendMessage(userId, "🎉 Payment verified! Service activated.");
  ctx.reply("✅ Approved");
});

// ===== ADMIN REJECT =====
bot.command("reject", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;

  const userId = ctx.message.text.split(" ")[1];
  bot.telegram.sendMessage(userId, "❌ Payment rejected.");

  ctx.reply("Rejected");
});

bot.launch();
console.log("🔥 Bot Running...");
