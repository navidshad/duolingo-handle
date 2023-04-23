<template>
  <FrameBorder v-slot="{ locked }">
    <Frameheader ref="header" title="Voice Recognition" :locked="locked">
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
        >
          <v-icon color="error" />
        </v-btn>

        <button-language
          :disabled="!text.length"
          :loading="isTranslating"
          :isActive="showTranslate"
          @click="toggleTranslate"
        />
      </template>
    </Frameheader>

    <section>
      <p v-if="showTranslate && translatedText.length">{{ translatedText }}</p>
      <p v-else>{{ text }}</p>
    </section>
  </FrameBorder>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getAudioStream } from "@/helpers/audio";
import { blobToBase64 } from "@/helpers/file";

// @ts-ignore
import HeaderMixin from "@/mixins/header-hight.js";

export default defineComponent({
  mixins: [HeaderMixin],
  
  data() {
    //@ts-ignore
    let recorder: MediaRecorder = null;

    return {
      isRecording: false,
      isTranslating: false,
      showTranslate: false,
      recorder,
      chunks: <BlobPart[]>[],
      text: "",
      translatedText: "",
    };
  },
  methods: {
    async startRecording() {
      this.text = "";
      this.translatedText = "";
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

    toggleTranslate() {
      this.showTranslate = !this.showTranslate;

      if (this.showTranslate && !this.translatedText.length) {
        this.isTranslating = true;
        window.electronAPI
          .translateText({ phrase: this.text, lang: "fa" })
          .then(([translated]) => {
            this.translatedText = translated;
          })
          .finally(() => (this.isTranslating = false));
      }
    },
  },
});
</script>