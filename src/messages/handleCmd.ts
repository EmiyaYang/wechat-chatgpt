import { Message } from "wechaty";
import { RoomImpl } from "wechaty/impls";
import { ChatGPTBot, ICommand } from "../bot.js";
import DBUtils from "../data.js";

const commands: ICommand[] = [
  {
    name: "help",
    description: "显示帮助信息",
    exec: async function (talker) {
      await this.trySay(
        talker,
        "========\n" +
          "/cmd help\n" +
          "# 显示帮助信息\n" +
          "/cmd data\n" +
          "# 展示当前上下文用户消息数量\n" +
          "/cmd prompt <PROMPT>\n" +
          "# 设置当前会话的 prompt \n" +
          "/img <PROMPT>\n" +
          "# 根据 prompt 生成图片\n" +
          "/cmd clear\n" +
          "# 清除自上次启动以来的所有会话\n" +
          "========"
      );
    }
  },
  {
    name: "data",
    description: "消息列表",
    exec: async function (talker) {
      let username: string;
      if (talker instanceof RoomImpl) {
        username = await talker.topic();
      } else {
        username = talker.name();
      }

      const messages = DBUtils.getChatMessage(username);
      console.log("messages", messages);

      const userMessages = messages.filter((item) => item.role === "user");
      await this.trySay(
        talker,
        `当前用户消息数量: ${userMessages.length}, 输入 /cmd clear 清除`
      );
    }
  },
  {
    name: "prompt",
    description: "设置当前会话的prompt",
    exec: async function (talker, prompt) {
      let username: string;
      if (talker instanceof RoomImpl) {
        username = await talker.topic();
      } else {
        username = talker.name();
      }

      if (!prompt) {
        return await this.trySay(
          talker,
          "prompt: " + DBUtils.getPrompt(username)
        );
      }

      if (talker instanceof RoomImpl) {
        DBUtils.setPrompt(username, prompt);
      } else {
        DBUtils.setPrompt(username, prompt);
      }

      await this.trySay(talker, "done");
    }
  },
  {
    name: "clear",
    description: "清除自上次启动以来的所有会话",
    exec: async function (talker) {
      if (talker instanceof RoomImpl) {
        DBUtils.clearHistory(await talker.topic());
      } else {
        DBUtils.clearHistory(talker.name());
      }

      await this.trySay(talker, "done");
    }
  }
];

export const isCmdMessage = (message: Message) =>
  message.text() === "/cmd" || message.text().startsWith("/cmd ");

export const handleCmd = async (message: Message, botIns: ChatGPTBot) => {
  async function execCommand(contact: any, rawText: string): Promise<void> {
    const [commandName, ...args] = rawText.split(/\s+/);
    const command =
      commands.find((command) => command.name === commandName) || commands[0];

    if (command) {
      await command.exec.call(botIns, contact, args.join(" "));
    }
  }

  const talker = message.talker();
  const rawText = message.text();
  const room = message.room();
  const privateChat = !room;

  console.log(`🤖 Command: ${rawText}`);
  const cmdContent = rawText.slice(5); // 「/cmd 」一共5个字符(注意空格)
  if (privateChat) {
    await execCommand(talker, cmdContent);
  } else {
    await execCommand(room, cmdContent);
  }
};
