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

function getUserCount() {
  return Object.keys(users).length;
}

// ===== ORDER ID =====
function generateOrderId() {
  return Math.floor(100000 + Math.random() * 900000);
}

// ===== START =====
bot.start((ctx) => {
  const user = ctx.from;

  // save user (duplicate safe)
  if (!users[user.id]) {
    users[user.id] = { premium: false };
    saveUsers();

    // notify admin only new user
    ctx.telegram.sendMessage(ADMIN_ID,
      `👤 New User\nID: ${user.id}\nUsername: @${user.username}`
    );
  }

  ctx.replyWithPhoto(
    { source: './IMG_20260317_180557_447.jpg' },
    {
      caption: `
💎 WELCOME TO PREMIUM PRIVATE SERVICES

👥 Total Users: ${getUserCount()}

🔥 Limited Access Available

🎯 What You Get:
🎥 1 Hour Video Call  
💬 Private Chat  
📸 Exclusive Content  

💰 Starting Just ₹50

👇 Choose option below 👇
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

👥 Users: ${getUserCount()}

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

1️⃣ Payment karo  
2️⃣ Screenshot bhejo  
3️⃣ 2 min me service milegi  
  `);
});

// ===== PAYMENT =====
bot.action('payment', async (ctx) => {
  ctx.reply(`
💳 Payment Info

UPI: dipika.bharti@ptyes

✔ Screenshot bhejo after payment
  `);
});

// ===== CONTACT =====
bot.action('contact', (ctx) => {
  ctx.editMessageCaption(`
📞 Contact:

Instagram: @neharoyyxx
  `, {
    ...Markup.inlineKeyboard([
      [Markup.button.callback("⬅ Back", "menu")]
    ])
  });
});

// ===== MENU =====
bot.action('menu', (ctx) => {
  ctx.editMessageCaption(`🏠 Main Menu

👥 Total Users: ${getUserCount()}`, {
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
  ctx.reply("✅ Screenshot sent. Wait for approval...");

  bot.telegram.sendMessage(ADMIN_ID, `📩 Payment from: ${userId}`);
});

// ===== ADMIN APPROVE =====
bot.command("approve", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;

  const userId = ctx.message.text.split(" ")[1];
  if (!userId) return ctx.reply("Use: /approve USER_ID");

  users[userId] = { premium: true };
  saveUsers();

  bot.telegram.sendMessage(userId, "🎉 Payment verified!");
  ctx.reply("✅ Approved");
});

// ===== ADMIN REJECT =====
bot.command("reject", (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;

  const userId = ctx.message.text.split(" ")[1];
  bot.telegram.sendMessage(userId, "❌ Payment rejected.");

  ctx.reply("Rejected");
});

// ===== 🔥 BROADCAST TEXT =====
bot.command("broadcast", async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;

  const msg = ctx.message.text.replace("/broadcast ", "");
  const ids = Object.keys(users);

  let success = 0, fail = 0;

  for (let id of ids) {
    try {
      await bot.telegram.sendMessage(id, msg);
      success++;
    } catch {
      fail++;
    }
  }

  ctx.reply(`✅ Broadcast Done\n👥 ${success} Success\n❌ ${fail} Failed`);
});

// ===== 🔥 BROADCAST PHOTO =====
bot.on("photo", async (ctx, next) => {
  if (ctx.from.id !== ADMIN_ID) return next();

  const ids = Object.keys(users);
  let success = 0, fail = 0;

  for (let id of ids) {
    try {
      await bot.telegram.sendPhoto(
        id,
        ctx.message.photo[ctx.message.photo.length - 1].file_id,
        { caption: ctx.message.caption || "" }
      );
      success++;
    } catch {
      fail++;
    }
  }

  ctx.reply(`📸 Photo Broadcast Done\n✅ ${success}\n❌ ${fail}`);
});

bot.launch();
console.log("🔥 Bot Running...");
