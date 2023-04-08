import vision from "@google-cloud/vision";
import { ipcMain } from "electron";

import {
	GoogleAuth,
	grpc
} from 'google-gax';

export class GoogleVision {

	private static instance: GoogleVision;
	private apiKey: string;

	constructor(apiKey = '') {
		this.apiKey = apiKey;
		GoogleVision.instance = this;

		ipcMain.handle('vision:detect-text', (event, data) => {
			return this.detectTextFromImage(data);
		})
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
		const sslCreds = this.getApiKeyCredentials();
		const client = new vision.ImageAnnotatorClient({ sslCreds });

		const request = {
			image: {
				content: Buffer.from(base64Content, 'base64')
			},
			"imageContext": {
				"languageHints": ["en-t-i0-und"]
			}
		};

		return client.textDetection(request).then(([result]) => {
			return result.textAnnotations
		})
	}
}