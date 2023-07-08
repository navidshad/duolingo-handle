export interface CompletionMessage {
	role: 'system' | 'user' | 'assistant',
	content: string,
}