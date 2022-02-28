import "dotenv/config";
import { SessionsClient } from "@google-cloud/dialogflow";

import configs from "../configs/dialogFlowConfig.json";
configs.client_id = process.env.DIALOGFLOW_CLIENT_ID;
configs.private_key_id = process.env.DIALOGFLOW_PRIVATE_KEY_ID;
configs.private_key = process.env.DIALOGFLOW_PRIVATE_KEY.replace(/\\n/g, "\n");

class DialogflowService {
  private sessionClient: SessionsClient;

  constructor() {
    this.sessionClient = new SessionsClient({
      projectId: configs.project_id,
      credentials: {
        private_key: configs.private_key,
        client_email: configs.client_email,
      },
    });
  }

  async sendMessage(chatId: string, message: string) {
    const sessionPath = this.sessionClient.projectAgentSessionPath(
      configs.project_id,
      chatId
    );

    const textQueryInput = {
      text: {
        text: message,
        languageCode: "pt-BR",
      },
    };

    const eventQueryInput = {
      event: {
        name: "start",
        languageCode: "pt-BR",
      },
    };

    const request = {
      session: sessionPath,
      queryInput: message === "/start" ? eventQueryInput : textQueryInput,
    };

    const [response] = await this.sessionClient.detectIntent(request);
    const { fulfillmentText, intent, parameters } = response.queryResult;

    return {
      text: fulfillmentText,
      intent: intent.displayName,
      fields: parameters.fields,
    };
  }
}

export { DialogflowService };
