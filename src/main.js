import * as dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { ogg } from "./ogg.js";

dotenv.config();

const { BOT_TOKEN } = process.env;

const bot = new Telegraf(BOT_TOKEN);

bot.on(message("voice"), async (ctx) => {
  try {
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = String(ctx.message.from.id);
    console.log(link.href);

    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId);

    await ctx.reply(JSON.stringify(mp3Path, null, 2));
  } catch (error) {
    console.log(`Error while voice message`, error.message);
  }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
