import { Bot } from "grammy";
import express, { json } from "express";
import { webhookCallback } from "grammy";

// Bot yaratish
const bot = new Bot("8148944761:AAE9RCUzC_nbnBXraN3szMQ3nHnzE4x_gaI");

// Xabarni qayta ishlash
bot.on("message", (ctx) => {
  ctx.reply("Salom! Bu serverdagi botdan xabar!");
});

// HTTP server yaratish
const app = express();

app.use(json());

// Webhookni sozlash
app.use("/bot", webhookCallback('/bot')); // To‘g‘ridan-to‘g‘ri botni ulash

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishga tushdi.`);
  bot.api.setWebhook(`https://bot.takedaservice.uz/bot`).then(() => {
    console.log("Webhook muvaffaqiyatli sozlandi!");
  }).catch((err) => {
    console.error("Webhookni sozlashda xatolik yuz berdi:", err);
  });
});
