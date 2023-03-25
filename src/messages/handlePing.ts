import { Message } from "wechaty";

export const isPingMessage = (message: Message) =>
  message.text().startsWith("/ping");

export const handlePing = async (message: Message) => {
  await message.say("pong");
};
