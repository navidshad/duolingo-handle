import { ipcMain } from "electron";

export class TextService {

	private static instance: TextService;

	constructor() {
		TextService.instance = this;

		ipcMain.handle('text:validate-word', (event, word) => {
			return this.handelWordValidation(word)
		})
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
}