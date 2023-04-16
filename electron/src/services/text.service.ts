import { ipcMain } from "electron";

import {
	Configuration,
	OpenAIApi
} from 'openai';

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
		ipcMain.handle('text:validate-word', (event, word) =>  this.handelWordValidation(word))
		ipcMain.handle('text:create-completion', (event, prompt) =>  this.createCompletion(prompt))
	}

	static getInstance() {
		return this.instance;
	}

	private handelWordValidation(word: string) {
		const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURI(word);

		return fetch(url)
			.then(req => {
				if (!req.ok) return false;
				return req.json();
			}).then(body => {
				return Array.isArray(body)
			})
	}

	private createCompletion(prompt: string) {
		return this.openai.createCompletion({
			model: "text-curie-001",
			prompt: prompt,
			temperature: 0.5,
			max_tokens: 1024,
		}).then(res => {
			const [c1] = res.data.choices
			return c1.text;
		})
	}
}