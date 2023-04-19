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
  </FrameBorder>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      isRecording: false,
    };
  },
  methods: {
    startRecording() {
      this.isRecording = true;
    },

    stopRecording() {
      this.isRecording = false;
    },
  },
});
</script>