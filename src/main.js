require("dotenv").config();
const { Telegraf } = require("telegraf");
const fs = require("fs");
const wolframAPI = require("./lib/WolframAlphaAPI");
const handleImg = require("./lib/handleImg");

const bot = new Telegraf(process.env.BOT_TOKEN);
const wolfram = wolframAPI(process.env.WOLFRAM_ID);

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) =>
  ctx.reply(
    "This little bot is designed to solve mathematical problems, in addition to giving definitions and wikipedia articles. \n I'm quite a Nerd!"
  )
);

bot.command("solve", async (ctx) => {
  const query = ctx.message.text.substring("/solve ".length);
  const sucess = await handleImg(query, wolfram);
  if (sucess) {
    ctx.replyWithPhoto({
      source: fs.createReadStream("./src/images/response.gif"),
    });
  } else {
    ctx.reply("bobo");
  }
});

bot
  .launch()
  .then(() => console.log("Bot Running!"))
  .catch((err) => console.log(err));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
