<template>
  <v-btn
    :size="size"
    icon="fa-solid fa-microphone-lines"
    v-if="!isRecording"
    :loading="isLoading"
    @click="startRecording"
  />

  <v-btn
    :size="size"
    icon="fa-solid fa-stop-circle"
    v-else
    @click="stopRecording"
  >
    <v-icon color="error" />
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAudioStream } from "@/helpers/audio";
import { blobToBase64 } from "@/helpers/file";

export default defineComponent({
  props: {
    size: {
      type: String,
      default: "x-small",
      validate: (val: string) =>
        ["x-small", "small", "medium", "large"].includes(val),
    },

    startOnMount: {
      type: Boolean,
      default: false,
    },
  },

  mounted() {
	if (this.startOnMount) this.startRecording();
  },

  data() {
    //@ts-ignore
    let recorder: MediaRecorder = null;

    return {
      isRecording: false,
      isLoading: false,
      recorder,
      chunks: <BlobPart[]>[],
      text: "",
    };
  },

  watch: {
    text(val) {
      this.$emit("onText", val);
    },
  },

  methods: {
    async startRecording() {
      this.text = "";
      this.chunks = [];
      this.isRecording = true;

      const stream = await getAudioStream();
      this.recorder = new MediaRecorder(stream);

      // Handle data available event
      const _this = this;
      this.recorder.addEventListener("dataavailable", function (event: any) {
        _this.chunks.push(event.data);
      });

      // Handle stop event
      this.recorder.addEventListener("stop", this.onRecordEnded);

      this.recorder.start();
      console.log("Recording started");
    },

    stopRecording() {
      this.isRecording = false;
      this.recorder.stop();
    },

    async onRecordEnded() {
      this.isLoading = true;
      const blob = new Blob(this.chunks, { type: "audio/wav" });
      const base64 = await blobToBase64(blob);

      window.electronAPI
        .detectTextFromAudio(base64)
        .then((text: any) => (this.text = text))
        .finally(() => (this.isLoading = false));
    },
  },
});
</script>