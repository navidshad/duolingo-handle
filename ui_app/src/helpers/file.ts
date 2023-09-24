export function blobToBase64(data: Blob) {
	return new Promise<string>((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(data);

		reader.onloadend = function () {
			const base64data = reader.result;
			resolve(base64data as string);
		}
	}).then(result => result.split('base64,')[1]);
}