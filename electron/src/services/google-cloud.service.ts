import { ImageAnnotatorClient } from "@google-cloud/vision";
import { SpeechClient } from '@google-cloud/speech';
import { ipcMain } from "electron";

import {
	GoogleAuth,
	grpc
} from 'google-gax';
import { postData } from "./http.service";

export class GoogleCloud {

	private static instance: GoogleCloud;

	private visionClient!: ImageAnnotatorClient;
	private speechClient!: SpeechClient;
	private apiKey: string;

	constructor(apiKey = '') {
		this.apiKey = apiKey;
		GoogleCloud.instance = this;

		const sslCreds = this.getApiKeyCredentials();
		this.visionClient = new ImageAnnotatorClient({ sslCreds });
		this.speechClient = new SpeechClient({ sslCreds });

		ipcMain.handle('gcloud:detect-text', (event, data) => this.detectTextFromImage(data))
		ipcMain.handle('gcloud:detect-text-from-audio', (event, data) => this.detectTextFromAudio(data))
		ipcMain.handle('gcloud:translate-text', (event, data) => this.translateText(data))
	}

	static getInstance() {
		return this.instance;
	}

	private getApiKeyCredentials() {
		const sslCreds = grpc.credentials.createSsl();
		const googleAuth = new GoogleAuth();
		const authClient = googleAuth.fromAPIKey(this.apiKey);
		const credentials = grpc.credentials.combineChannelCredentials(
			sslCreds,
			grpc.credentials.createFromGoogleCredential(authClient)
		);

		return credentials;
	}

	detectTextFromImage(base64Content: string) {
		const request = {
			image: {
				content: Buffer.from(base64Content, 'base64')
			},
			// "imageContext": {
			// 	"languageHints": ["en-t-i0-und"]
			// }
		};

		return this.visionClient.documentTextDetection(request).then(([result]) => {
			return result.textAnnotations
		})

		// return this.visionClient.textDetection(request).then(([result]) => {
		// 	return result.textAnnotations
		// })
	}

	async detectTextFromAudio(base64: string) {
		const request = {
			config: {
				languageCode: 'en',
			},
			audio: {
				content: base64,
			},
		};

		// Detects speech in the audio file
		const [response] = await this.speechClient.recognize(request);

		return response.results
			.map(result => result.alternatives[0].transcript)
			.join('\n');
	}

	translateText({ phrase, lang }: { phrase: string, lang: string }) {
		const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;

		const body = {
			q: phrase,
			target: lang,
		}

		return postData(url, body)
			.then((body: any) => body.data.translations)
			.then((list: any[]) => {

				let newList = list.map(
					(item: { translatedText: string; detectedSourceLanguage: string }) =>
						item.translatedText
				) as string[];

				return newList;
			});
	}
}