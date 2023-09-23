const { OpenAI } = require("openai");

class TextService {
  constructor() {
    TextService.instance = this;

    // init OpenAi API
    //
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY,
    });
  }

  static getInstance() {
    return this.instance;
  }

  handelWordValidation(word = "") {
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

  createCompletion({ prompt = "", model = "text-davinci-003" }) {
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
  createChatCompletion({ messages = [], model = "gpt-4" }) {
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
}

module.exports.textService = new TextService();
