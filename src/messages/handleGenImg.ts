import { FileBox } from "file-box";
import { Message } from "wechaty";
import { dalle } from "../openai.js";

// 使用DallE生成图片
export const isGenImgMessage = (message: Message) =>
  message.text().startsWith("/img");

export const handleImgGen = async (message: Message) => {
  const rawText = message.text();
  const talker = message.talker();
  const room = message.room();
  const privateChat = !room;

  console.log(`🤖 Image: ${rawText}`);
  const imgContent = rawText.slice(4);
  if (privateChat) {
    let url = (await dalle(talker.name(), imgContent)) as string;
    const fileBox = FileBox.fromUrl(url);
    message.say(fileBox);
  } else {
    let url = (await dalle(await room.topic(), imgContent)) as string;
    const fileBox = FileBox.fromUrl(url);
    message.say(fileBox);
  }
  return;
};
