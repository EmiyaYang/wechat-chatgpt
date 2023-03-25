import { Message } from "wechaty";
import { MessageType } from "../interface.js";
import { whisper } from "../openai.js";

export const isAudioMessage = (message: Message) =>
  message.type() === MessageType.Audio;

export const handleAudio = async (message: Message) => {
  // 保存语音文件
  const fileBox = await message.toFileBox();
  let fileName = "./public/" + fileBox.name;
  await fileBox.toFile(fileName, true).catch((e) => {
    console.log("保存语音失败", e);
    return;
  });
  // Whisper
  whisper("", fileName).then((text) => {
    message.say(text);
  });
  return;
};
