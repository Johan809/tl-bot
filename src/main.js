require("dotenv").config();
const { Telegraf } = require("telegraf");
const fs = require("fs");
const wiki = require("wikijs").default;
const dict = require("google-dictionary-api");

const wolframAPI = require("./lib/WolframAlphaAPI");
const handleImg = require("./lib/handleImg");

const bot = new Telegraf(process.env.BOT_TOKEN);
const wolfram = wolframAPI(process.env.WOLFRAM_ID);

bot.start((ctx) => ctx.reply("Welcome to the NerdBot ^^"));
bot.help((ctx) =>
  ctx.reply(
    "This little bot is designed to solve mathematical problems, in addition to giving definitions and wikipedia articles. \n I'm quite a Nerd!"
  )
);
bot.command("list", (ctx) => {
  let str = "This are the avaliable commands:\n";
  str +=
    " /solve <math problem>: It gives you the answer to said mathematical problem.\n";
  str +=
    " /wiki <text>: look for an article on Wikipedia about what you searched for.\n";
  str += " /def <word>: Gives you the definition of that word.";
  ctx.reply(str);
});

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
bot.command("wiki", async (ctx) => {
  const query = ctx.message.text.substring("/wiki ".length);
  wiki()
    .find(query)
    .then(async (page) => {
      ctx.reply(await page.summary());
    })
    .catch(() => ctx.reply("Bobo happend"));
});
bot.command("def", async (ctx) => {
  const query = ctx.message.text.substring("/def ".length);
  dict
    .search(query)
    .then((data) => {
      console.log(data);
      let str = `Word: ${data[0]["word"]} \n\n`;
      str += `Noun Definition: ${data[0]["meaning"]["noun"][0]["definition"]}\n\n`;
      str += `Verb Definition: ${data[0]["meaning"]["transitive verb"][0]["definition"]}`;
      ctx.reply(str);
    })
    .catch((err) => {
      console.log(err);
      ctx.reply("Bobo happend");
    });
});

bot
  .launch()
  .then(() => console.log("Bot Running!"))
  .catch((err) => console.log(err));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
