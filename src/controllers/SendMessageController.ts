import TelegramBot, { Message } from "node-telegram-bot-api";
import { DialogflowService } from "../services/DialogflowService";
import { MyAnimeListService } from "../services/MyAnimeListService";

const dialogFlowService = new DialogflowService();
const animeService = new MyAnimeListService();

class SendMessageController {
  async handle(message: Message, bot: TelegramBot) {
    const { id, first_name } = message.chat;

    /* console.log("chat first_name", first_name);
    console.log("chat message", msg.text); */

    const dfResponse = await dialogFlowService.sendMessage(
      id.toString(),
      message.text
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
        console.error("error:  ", error);
        if (error.status == 404) {
          textResponse = "Animes não encontrados";
        }
      }
    }

    bot.sendMessage(id, textResponse);
  }
}

export { SendMessageController };
