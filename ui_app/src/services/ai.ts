import { TextAnnotation } from "@/types/vision";
import { CompletionMessage } from "@/types/gpt";
import { httpClient } from "@/plugins/axios";

const voucher = null;
async function getVoucher() {
  if (voucher) {
    return voucher;
  }

  return window.electronAPI.readFromStore("voucher");
}

export async function detectTextPositionsFromImage(base64Content: string) {
  const url = "/ai/detect-text-positions";
  const body = { base64Content };

  const options = {
    headers: {
      voucher: await getVoucher(),
    },
  };

  return httpClient.post(url, body, options) as unknown as Promise<
    TextAnnotation[]
  >;
}

export async function detectTextFromImage(base64Content: string) {
  const url = "/ai/detect-text";
  const body = { base64Content };

  const options = {
    headers: {
      voucher: await getVoucher(),
    },
  };

  return httpClient.post(url, body, options) as unknown as Promise<string>;
}

export async function detectTextFromAudio(base64Content: string) {
  const url = "/ai/detect-text-from-audio";
  const body = { base64Content };

  const options = {
    headers: {
      voucher: await getVoucher(),
    },
  };

  return httpClient.post(url, body, options) as unknown as Promise<string>;
}

export async function translateText(data: { phrase: string; lang: string }) {
  const url = "/ai/translate-text";

  const options = {
    headers: {
      voucher: await getVoucher(),
    },
  };

  return httpClient.post(url, data, options) as unknown as Promise<string[]>;
}

export async function checkValidWord(word: string) {
  const url = "/ai/validate-word";
  const body = { word };

  const options = {
    headers: {
      voucher: await getVoucher(),
    },
  };

  return httpClient.post(url, body, options) as unknown as Promise<boolean>;
}

export async function createCompletion(data: {
  prompt: string;
  model?: string;
}) {
  const url = "/ai/create-completion";

  const options = {
    headers: {
      voucher: await getVoucher(),
    },
  };

  return httpClient.post(url, data, options) as unknown as Promise<string>;
}

export async function createChatCompletion(data: {
  message: CompletionMessage[];
  model?: string;
}) {
  const url = "/ai/create-chat-completion";

  const options = {
    headers: {
      voucher: await getVoucher(),
    },
  };

  return httpClient.post(url, data, options) as unknown as Promise<string>;
}
