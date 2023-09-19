import { Rectangle } from "../types/base";

export const captureScreenShotBySourceID = (sourceId: string, bound: Rectangle) => {

	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d") as CanvasRenderingContext2D;
	const video = document.createElement("video");

	return new Promise(async (resolve, reject) => {
		try {
			const captureStream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					mandatory: {
						chromeMediaSource: 'desktop',
						chromeMediaSourceId: sourceId,
					}
				} as any
			})

			video.srcObject = captureStream;

			// Set canvase size as same as the window
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			video.onloadedmetadata = (e) => {
				video.play()

				// https://cloudinary.com/guides/automatic-image-cropping/cropping-images-in-javascript
				context.drawImage(video, bound.x, bound.y, bound.width, bound.height, 0, 0, bound.width, bound.height);

				const frame = canvas.toDataURL("image/png").split('base64,')[1];
				captureStream.getTracks().forEach(track => track.stop());
				resolve(frame);
			}
		} catch (err) {
			reject(err);
		}
	})
};

export const extractAnnotationsFromScreen = async (coordinateBoundOffset?: {
	x?: number | undefined;
	y?: number | undefined;
} | undefined) => {
	const base64 = await window.electronAPI.takeScreenShot({ coordinateBoundOffset });
	return window.electronAPI.detectTextPositionsFromImage(base64);
}

export const extractTextFromScreen = async (coordinateBoundOffset?: {
	x?: number | undefined;
	y?: number | undefined;
} | undefined) => {
	const base64 = await window.electronAPI.takeScreenShot({ coordinateBoundOffset });
	return window.electronAPI.detectTextFromImage(base64);
}

export const extractTextWithCustomBound = async (bound: Rectangle) => {
	const base64 = await window.electronAPI.takeScreenShot({ customBound: bound });
	return window.electronAPI.detectTextFromImage(base64);
}