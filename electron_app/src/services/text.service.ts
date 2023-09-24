import { ipcMain } from "electron";

import robotjs from "robotjs";

import { Configuration, OpenAIApi } from "openai";

export class TextService {
  private static instance: TextService;
  private openai: OpenAIApi;

  constructor() {
    TextService.instance = this;

    // init OpenAi API
    //
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_KEY,
    });

    this.openai = new OpenAIApi(configuration);

    // Register IPC Events
    ipcMain.handle("text:validate-word", (event, word) =>
      this.handelWordValidation(word),
    );
    ipcMain.handle("text:create-completion", (event, data) =>
      this.createCompletion(data),
    );
    ipcMain.handle("text:create-chat-completion", (event, data) =>
      this.createChatCompletion(data),
    );
    ipcMain.handle("text:write-by-keyboard", (event, data) =>
      this.writeByKeyboard(data),
    );
  }

  static getInstance() {
    return this.instance;
  }

  private handelWordValidation(word: string) {
    const url =
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURI(word);

    return fetch(url)
      .then((req) => {
        if (!req.ok) return false;
        return req.json();
      })
      .then((body) => {
        return Array.isArray(body);
      });
  }

  private createCompletion({ prompt = "", model = "text-davinci-003" }) {
    return this.openai
      .createCompletion({
        model,
        prompt,
        temperature: 0.5,
        max_tokens: 1024,
      })
      .then((res) => {
        const [c1] = res.data.choices;
        return c1.text;
      });
  }

  // https://platform.openai.com/docs/guides/gpt/chat-completions-api
  private createChatCompletion({ messages = <any>[], model = "gpt-4" }) {
    return this.openai
      .createChatCompletion({
        model,
        messages: messages,
      })
      .then((res) => {
        const [c1] = res.data.choices;
        return c1.message.content;
      });
  }

  private writeByKeyboard(string: string) {
    robotjs.typeStringDelayed(string, 1000);
  }
}
