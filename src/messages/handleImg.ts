import path from "path";
import { createWorker } from "tesseract.js";
import fse from "fs-extra";
import { Message } from "wechaty";
import { MessageType } from "../interface.js";

const DOWNLOAD_DIR = "public";
fse.ensureDir(DOWNLOAD_DIR).then(() => fse.emptyDir(DOWNLOAD_DIR));

export const isImageMessage = (message: Message) =>
  message.type() === MessageType.Image;

export const handleImage = async (message: Message) => {
  const image = message.toImage();
  const fileBox = await image.artwork();
  const fileName = fileBox.name;
  const destPath = path.join(DOWNLOAD_DIR, fileName);

  const worker = await createWorker({
    logger: (m) => console.log(m)
  });

  try {
    await fileBox.toFile(destPath);
    await worker.loadLanguage("chi_sim");
    await worker.initialize("chi_sim");
    const {
      data: { text }
    } = await worker.recognize(destPath);
    await worker.terminate();

    return message.say(text);
  } catch (error: any) {
    console.log("OCR failed: ", error);
    return message.say("OCR failed, reason: " + error.message);
  }
};
