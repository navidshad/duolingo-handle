<template>
  <div
    class="w-screen h-screen border-2"
    :class="{
      'border-orange-400': !locked,
      'border-gray-400': locked,
    }"
  >
    <slot :locked="locked"></slot>
  </div>
</template>

<script lang="ts">
import { BaseEvent, SetIgnoreMouseEvents } from "@/types/event";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      locked: false,
    };
  },

  mounted() {
    window.electronAPI.onMessage(this.onMessage);
  },

  methods: {
    onMessage(event: any, data: BaseEvent) {
      if (data.type != "set-ignore-mouse-event") return;
      this.locked = (data as SetIgnoreMouseEvents).value;
    },
  },
});
</script>

<style scoped>
</style>