import { Configuration, OpenAIApi } from "openai";
import { createReadStream } from "fs";
import { log } from "console";
import * as dotenv from "dotenv";

dotenv.config();

class OpenAI {
  roles = {
    ASSISTANT: "assistant",
    USER: "user",
    SYSTEM: "system",
  };

  constructor() {
    const { OPENAI_API_KEY } = process.env;

    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async chat(messages) {
    try {
      const response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      return response.data.choices[0].message;
    } catch (error) {
      console.log("Error while GPT chat", error.message);
    }
  }

  async transcription(filePath) {
    try {
      const response = await this.openai.createTranscription(
        createReadStream(filePath),
        "whisper-1"
      );
      return response.data.text;
    } catch (error) {
      console.log("Error while transcription", error.message);
    }
  }
}

export const openai = new OpenAI();
