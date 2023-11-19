<template>
  <v-btn
    :size="size"
    icon="fa-solid fa-microphone-lines"
    variant="text"
    v-if="!isRecording"
    :loading="isLoading"
    @click="startRecording"
  />

  <v-btn
    :size="size"
    icon="fa-solid fa-stop-circle"
    variant="text"
    v-else
    @click="stopRecording"
  >
    <v-icon color="error" />
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { detectTextFromAudio } from "@/services/ai";

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
    return {
      isRecording: false,
      isLoading: false,
      recordId: "",
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
      this.isRecording = true;

      await window.electronAPI
        .startRecording()
        .then((id) => {
          this.recordId = id;
          this.$emit("onStart");
          console.log("Recording started", this.recordId);
        })
        .catch((err) => {
          console.error(err);
          this.isRecording = false;
        });
    },

    stopRecording() {
      this.isRecording = false;
      window.electronAPI
        .stopRecording(this.recordId)
        .then((base64: string) => this.onRecordEnded(base64));
    },

    async onRecordEnded(base64: string) {
      this.isLoading = true;

      this.$emit("onAudioBase64", base64);

      await detectTextFromAudio(base64)
        .then((text: any) => (this.text = text || ""))
        .finally(() => (this.isLoading = false));
    },
  },
});
</script>
