import "dotenv/config";
import express from "express";
import cors from "cors";
import TelegramBot from "node-telegram-bot-api";
import { SendMessageController } from "./controllers/SendMessageController";

const app = express();
app.use(cors());

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (message) =>
  new SendMessageController().handle(message, bot)
);

app.use(express.json());

const port = process.env.PORT;

app.get("/", (request, response) => {
  response.json({
    status: "Running",
    message: `🚀 Server is running on port ${port}!`,
  });
});

app.listen(port, () => console.log(`🚀 Server is running on port ${port}!`));
