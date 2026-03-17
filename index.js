const { Telegraf } = require('telegraf');

// 👇 YAHAN APNA TOKEN DALO
const bot = new Telegraf("8491538069:AAFn0NJV78rG4RZ9u3v5pttvVuCzTM6MmV0");

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
        [{ text: "1 Hour video call ₹350", callback_data: "buy_1" }],
        [{ text: "1 hour sx chat ₹150", callback_data: "buy_2" }],
        [{ text: "N*de photos ₹50", callback_data: "buy_3" }],
        [{ text: "🔙 Back", call[{ text: \"🔙 Back\", callback_data: \"menu\" }]back_data: "menu" }]
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
