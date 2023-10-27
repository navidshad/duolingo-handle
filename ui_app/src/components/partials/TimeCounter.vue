<script setup lang="ts">
import { TimeTickEvent } from "@/types/event";
import { computed } from "vue";
import { ref } from "vue";

const remainingTime = ref(75);

const timeDisplay = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60);
  const seconds = remainingTime.value % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
});

window.electronAPI.onMessage((e, data) => {
  if (TimeTickEvent.instanceof(data)) {
    remainingTime.value = data.remains;
  }
});
</script>

<template>
  <div>{{ timeDisplay }}</div>
</template>
