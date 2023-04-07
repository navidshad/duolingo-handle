import { Rectangle } from "@/types/base";

export const captureScreenShot = (sourceId: string, bound: Rectangle) => {

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
				context.drawImage(video, bound.x, bound.y, window.innerWidth, window.innerHeight, 0,0, window.innerWidth, window.innerHeight);
				
				const frame = canvas.toDataURL("image/png");
				captureStream.getTracks().forEach(track => track.stop());
				resolve(frame);
			}
		} catch (err) {
			reject(err);
		}
	})
};