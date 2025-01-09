/* eslint-disable no-undef */
import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { config } from "dotenv";
import { registerConversation } from "../conversations/index.js";
import { startCommand } from "../commands/index.js";

config()

export const bot = new Bot(process.env.TOKEN)

bot.use(session({
  initial: () => ({
    email: null,
    lang: null,
    role: null,
    conversation: {}
  })
}))

bot.use(conversations())
bot.use(createConversation(registerConversation))

bot.command('start', async (ctx) => {
  startCommand(ctx)
})