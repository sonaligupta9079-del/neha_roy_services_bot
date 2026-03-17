const { Telegraf } = require('telegraf');

// 👇 YAHAN APNA TOKEN DALO
const bot = new Telegraf("PASTE_YOUR_BOT_TOKEN_HERE");

// START
bot.start((ctx) => {
  ctx.reply("🌟 Welcome to Neha Roy Paid Services\n\nChoose option:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📋 View Services", callback_data: "services" }],
        [{ text: "📞 Contact", callback_data: "contact" }],
        [{ text: "💰 Payment Info", callback_data: "payment" }]
      ]
    }
  });
});

// SERVICES
bot.action('services', (ctx) => {
  ctx.editMessageText("📋 Available Services:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Instagram Growth ₹2999", callback_data: "buy_1" }],
        [{ text: "YouTube SEO ₹4500", callback_data: "buy_2" }],
        [{ text: "Branding Kit ₹3500", callback_data: "buy_3" }],
        [{ text: "🔙 Back", callback_data: "menu" }]
      ]
    }
  });
});

// BUY
bot.action(/buy_(.+)/, (ctx) => {
  ctx.reply("🛒 Order Received!\n\n👉 Payment karo\n👉 Screenshot bhejo @neharoy_official\n\nOrder process ho jayega ✅");
});

// CONTACT
bot.action('contact', (ctx) => {
  ctx.editMessageText("📞 Contact:\n\nInstagram: @neharoy_official\nWhatsApp: +91XXXXXXXXXX", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔙 Back", callback_data: "menu" }]
      ]
    }
  });
});

// PAYMENT
bot.action('payment', (ctx) => {
  ctx.editMessageText("💰 Payment Info:\n\nUPI: neharoy@upi\nName: Neha Roy\n\nPayment ke baad screenshot bhejo.", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔙 Back", callback_data: "menu" }]
      ]
    }
  });
});

// MENU
bot.action('menu', (ctx) => {
  ctx.editMessageText("🏠 Main Menu", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📋 View Services", callback_data: "services" }],
        [{ text: "📞 Contact", callback_data: "contact" }],
        [{ text: "💰 Payment Info", callback_data: "payment" }]
      ]
    }
  });
});

bot.launch();

console.log("Bot Running...");