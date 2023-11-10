<script setup lang="ts">
import { TimeTickEvent } from "@/types/event";
import { computed } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const remainingTime = ref(0);

const timeDisplay = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60);
  const seconds = remainingTime.value % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
});

window.electronAPI.onMessage((e, data) => {
  if (TimeTickEvent.instanceof(data)) {
    remainingTime.value = data.remains;

    if (data.remains <= 0) {
      router.push({ name: "timeup" });
    }
  }
});
</script>

<template>
  <div v-if="remainingTime">{{ timeDisplay }}</div>
</template>
