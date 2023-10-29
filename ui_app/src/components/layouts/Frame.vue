<template>
  <div
    class="w-screen h-screen border-2 overflow-hidden"
    :class="{
      'border-white': !locked,
      'border-gray-400': locked,
    }"
  >
    <slot :locked="locked"></slot>
  </div>
</template>

<script lang="ts">
import type { BaseEvent, SetIgnoreMouseEvents } from "@/types/event";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      default: "",
    },
  },
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

<style scoped></style>
