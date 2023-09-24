import { TextAnnotation } from "@/types/vision";
import { CompletionMessage } from "@/types/gpt";
import { httpClient } from "@/plugins/axios";

export function detectTextPositionsFromImage(base64Content: string) {
  const url = "/ai/detect-text-positions";
  const body = { base64Content };

  return httpClient.post(url, body) as unknown as Promise<TextAnnotation[]>;
}

export function detectTextFromImage(base64Content: string) {
  const url = "/ai/detect-text";
  const body = { base64Content };

  return httpClient.post(url, body) as unknown as Promise<string>;
}

export function detectTextFromAudio(base64Content: string) {
  const url = "/ai/detect-text-from-audio";
  const body = { base64Content };

  return httpClient.post(url, body) as unknown as Promise<string>;
}

export function translateText(data: { phrase: string; lang: string }) {
  const url = "/ai/translate-text";

  return httpClient.post(url, data) as unknown as Promise<string[]>;
}

export function checkValidWord(word: string) {
  const url = "/ai/validate-word";
  const body = { word };

  return httpClient.post(url, body) as unknown as Promise<boolean>;
}

export function createCompletion(data: { prompt: string; model?: string }) {
  const url = "/ai/create-completion";

  return httpClient.post(url, data) as unknown as Promise<string>;
}

export function createChatCompletion(data: {
  message: CompletionMessage[];
  model?: string;
}) {
  const url = "/ai/create-chat-completion";

  return httpClient.post(url, data) as unknown as Promise<string>;
}
