<template>
  <section
    class="w-screen h-screen bg-gray-900 opacity-30"
    @mousedown="onMouseDown"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

type Coordinate = { x: number; y: number };

export default defineComponent({
  data() {
    return {
      p1: <Coordinate>{ x: 0, y: 0 },
      p2: <Coordinate>{ x: 0, y: 0 },
    };
  },

  computed: {
    type() {
      return this.$route.query["type"];
    },
  },

  methods: {
    onMouseDown(event: MouseEvent) {
      this.p1.x = event.clientX;
      this.p1.y = event.clientY;

      window.addEventListener("mouseup", this.onMouseUp);
    },

    onMouseUp(event: MouseEvent) {
      window.removeEventListener("mouseup", this.onMouseUp);

      this.p2.x = event.clientX;
      this.p2.y = event.clientY;

      this.sendResizeSignal();
    },

    sendResizeSignal() {
      const width = Math.abs(this.p1.x - this.p2.x);
      const height = Math.abs(this.p1.y - this.p2.y);

      if(width < 50 || height < 50) return;

      const bound = { width, height, x: this.p1.x, y: this.p1.y };
      window.electronAPI.setBound(this.type as any, bound);
      this.$router.push("/" + this.type);
    },
  },
});
</script>

<style>
</style>