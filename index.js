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
        [{ text: "⬅ Back", callback_data: "menu" }]
      ]
    }
  });
});

// BUY
bot.action(/buy_(.+)/, (ctx) => {
  ctx.reply("🛒 Order Received!\n\n👉 Payment karo\n👉 Screenshot bhejo @neharoyyxx\n\nOrder process ho jayega ✅");
});

// CONTACT
bot.action('contact', (ctx) => {
  ctx.editMessageText("📞 Contact:\n\nInstagram: @neharoyyxx\nWhatsApp: not available", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔙 Back", callback_data: "menu" }]
      ]
    }
  });
});

// PAYMENT
bot.action('payment', async (ctx) => {
  try {
    await ctx.replyWithPhoto(
      { source: './IMG_20260317_180557_447.jpg' },   // QR image file
      {
        caption: `
💳 *Payment Instructions*

UPI ID: dipika.bharti@ptyes
Name: Dipika Bharti

1️⃣ QR scan karke payment karo  
2️⃣ Screenshot bot me bhejo  
3️⃣ Admin verify karke service activate karega

Thanks for choosing our service 🙏
        `,
        parse_mode: "Markdown"
      }
    );
  } catch (error) {
    console.log(error);
    ctx.reply("❌ Payment info bhejne me error aa gaya.");
  }
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
