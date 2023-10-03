export async function getAudioStream() {
  return new Promise<MediaStream>(async (resolve, reject) => {
    try {
      const captureStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      resolve(captureStream);
    } catch (err) {
      reject(err);
    }
  });
}
