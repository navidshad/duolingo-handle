<template>
  <FrameBorder v-slot="{ locked }">
    <Frameheader ref="header" title="Words Detector" :locked="locked">
      <template #actions>
        <v-btn
          size="x-small"
          icon="fa-solid fa-microphone-lines"
          v-if="!isRecording"
          @click="startRecording"
        />

        <v-btn
          size="x-small"
          icon="fa-solid fa-stop-circle"
          v-else
          @click="stopRecording"
        />

        <!-- <v-btn size="x-small" icon="fa fa-eraser" @click="clear" /> -->
      </template>
    </Frameheader>

    <section>
      <!-- <button>play</button> -->
      <p>{{ text }}</p>
    </section>
  </FrameBorder>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAudioStream } from "@/helpers/audio";
import { blobToBase64 } from "@/helpers/file";

export default defineComponent({
  data() {
    //@ts-ignore
    let recorder: MediaRecorder = null;

    return {
      isRecording: false,
      recorder,
      chunks: <BlobPart[]>[],
      text: "",
    };
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
      this.recorder.addEventListener("dataavailable", function (event) {
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
      const blob = new Blob(this.chunks, { type: "audio/wav" });
      const base64 = await blobToBase64(blob);
      this.text = await window.electronAPI.detectTextFromAudio(base64);
    },
  },
});
</script>