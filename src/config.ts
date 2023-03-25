import * as dotenv from "dotenv";
import { BLOCK_WORDS } from "./config/blockWords.js";
import { IConfig } from "./interface";

dotenv.config();
export const config: IConfig = {
  api: process.env.API || "https://api.openai.com",
  openai_api_key: process.env.OPENAI_API_KEY || "123456789",
  model: process.env.MODEL || "gpt-3.5-turbo",
  chatPrivateTriggerKeyword: process.env.CHAT_PRIVATE_TRIGGER_KEYWORD || "",
  chatTriggerRule: process.env.CHAT_TRIGGER_RULE || "",
  disableGroupMessage: process.env.DISABLE_GROUP_MESSAGE === "true",
  temperature: process.env.TEMPERATURE
    ? parseFloat(process.env.TEMPERATURE)
    : 0.6,
  blockWords: process.env.BLOCK_WORDS?.split(",") || [],
  chatgptBlockWords: BLOCK_WORDS.concat(
    process.env.CHATGPT_BLOCK_WORDS?.split(",") || []
  )
};
