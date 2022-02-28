import "dotenv/config";
import { DialogflowService } from "./services/DialogflowService";
import { MyAnimeListService } from "./services/MyAnimeListService";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_BOT_TOKEN;

const dialogFlowService = new DialogflowService();
const animeService = new MyAnimeListService();

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const { id, first_name } = msg.chat;

  console.log("chat first_name", first_name);
  console.log("chat message", msg.text);

  const dfResponse = await dialogFlowService.sendMessage(
    id.toString(),
    msg.text
  );

  console.log(dfResponse);

  let textResponse = dfResponse.text;

  if (dfResponse.intent === "Temporada Atual") {
    //textResponse = dfResponse.fields.corpo.stringValue;
    try {
      const { data: animes } = await animeService.getSeasonAnime();
      animes.forEach((anime) => {
        textResponse += `${anime.node.title} \n`;
      });
    } catch (error) {
      console.error(error);
      if (error.status == 404) {
        textResponse = "Animes não encontrados";
      }
    }
  }

  bot.sendMessage(id, textResponse);
  /*
  {
    reply_markup: {
      keyboard: [[{ text: "Teste" }]],
      resize_keyboard: true,
    },
  }

   */
});
