export async function getAudioStream() {
  return new Promise<MediaStream>(async (resolve, reject) => {
    try {
      const captureStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      console.log("Got audio stream ", captureStream);

      resolve(captureStream);
    } catch (err) {
      reject(err);
    }
  });
}
