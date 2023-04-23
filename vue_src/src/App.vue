<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { WindowType } from "./types/base";
import { SetIgnoreMouseEvents } from "./types/event";

export default defineComponent({
  provide() {
    return {
      sendLockSignal: this.sendLockSignal,
    };
  },

  methods: {
    sendLockSignal(type: WindowType, isLock: boolean) {
      window.electronAPI.sendMessage({
        type: "set-ignore-mouse-event",
        toolType: type,
        value: isLock,
      } as SetIgnoreMouseEvents);
    },
  },
});
</script>
