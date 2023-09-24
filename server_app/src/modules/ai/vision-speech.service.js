const { ImageAnnotatorClient } = require("@google-cloud/vision");
const { SpeechClient } = require("@google-cloud/speech");

const { GoogleAuth, grpc } = require("google-gax");

const { postData } = require("../../helper/http.service");

class VisionAndSpeechService {
  constructor() {
    this.apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    VisionAndSpeechService.instance = this;

    const sslCreds = this.getApiKeyCredentials();

    this.visionClient = new ImageAnnotatorClient({
      sslCreds,
    });

    this.speechClient = new SpeechClient({
      sslCreds,
    });
  }

  getApiKeyCredentials() {
    const sslCreds = grpc.credentials.createSsl();
    const googleAuth = new GoogleAuth();
    const authClient = googleAuth.fromAPIKey(this.apiKey);
    const credentials = grpc.credentials.combineChannelCredentials(
      sslCreds,
      grpc.credentials.createFromGoogleCredential(authClient),
    );

    return credentials;
  }

  detectTextPositionsFromImage(base64Content = "") {
    const request = {
      image: {
        content: Buffer.from(base64Content, "base64"),
      },
      // "imageContext": {
      // 	"languageHints": ["en-t-i0-und"]
      // }
    };

    return this.visionClient.documentTextDetection(request).then(([result]) => {
      return result.textAnnotations;
    });
  }

  detectTextFromImage(base64Content = "") {
    const request = {
      image: {
        content: Buffer.from(base64Content, "base64"),
      },
      // "imageContext": {
      // 	"languageHints": ["en-t-i0-und"]
      // }
    };

    return this.visionClient.textDetection(request).then(([result]) => {
      return result.fullTextAnnotation?.text || "";
    });
  }

  async detectTextFromAudio(base64 = "") {
    const request = {
      config: {
        languageCode: "en",
      },
      audio: {
        content: base64,
      },
    };

    // Detects speech in the audio file
    const [response] = await this.speechClient.recognize(request);

    return response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
  }

  translateText({ phrase, lang } = paylod) {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;

    const body = {
      q: phrase,
      target: lang,
    };

    return postData(url, body)
      .then((body) => body.data.translations)
      .then((list) => {
        let newList = list.map((item) => item.translatedText);
        return newList;
      });
  }
}

module.exports.visionAndSpeechService = new VisionAndSpeechService();
