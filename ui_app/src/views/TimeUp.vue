<script setup lang="ts">
import { ExitEvent } from "@/types/event";

function onClose() {
  window.electronAPI.sendMessage(new ExitEvent());
}
</script>

<template>
  <section
    class="w-screen h-screen flex flex-col items-center justify-center space-y-7"
  >
    <span class="text-2xl">Time is up!</span>
    <v-btn variant="text" @click="onClose">Close</v-btn>
  </section>
</template>
