<template>
  <section
    class="w-screen h-screen bg-gray-900 opacity-30 relative"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
  >
    <div class="absolute rounded border-2 border-yellow-600" :style="selectedAreaStyle" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

type Coordinate = { x: number; y: number };

export default defineComponent({
  data() {
    const data = {
      isTrackingMouse: false,
      mouseDownPos: <Coordinate>{ x: 0, y: 0 },
      mouseUpPos: <Coordinate>{ x: 0, y: 0 },
    };

    return data;
  },

  computed: {
    type() {
      return this.$route.query["type"];
    },

    selectedAreaStyle() {
      const width = Math.abs(this.mouseDownPos.x - this.mouseUpPos.x);
      const height = Math.abs(this.mouseDownPos.y - this.mouseUpPos.y);
      
      // @ts-ignore
      const top = this.mouseDownPos.y;
      // @ts-ignore
      const left = this.mouseDownPos.x;
      
      return {
        width: width + "px",
        height: height + "px",
        top: top + "px",
        left: left + "px",
      };
    },
  },

  methods: {
    onMouseDown(event: MouseEvent) {
      this.isTrackingMouse = true;
      this.mouseDownPos.x = event.screenX;
      this.mouseDownPos.y = event.screenY;

      window.addEventListener("mouseup", this.onMouseUp);
    },

    onMouseMove(event: MouseEvent) {
      if (!this.isTrackingMouse) return;

      this.mouseUpPos.x = event.screenX;
      this.mouseUpPos.y = event.screenY;
    },

    onMouseUp(event: MouseEvent) {
      this.isTrackingMouse = false;
      window.removeEventListener("mouseup", this.onMouseUp);

      this.mouseUpPos.x = event.screenX;
      this.mouseUpPos.y = event.screenY;

      this.sendResizeSignal();
    },

    sendResizeSignal() {
      const width = Math.abs(this.mouseDownPos.x - this.mouseUpPos.x);
      const height = Math.abs(this.mouseDownPos.y - this.mouseUpPos.y);

      if (width < 50 || height < 50) return;

      const bound = {
        width,
        height,
        x: this.mouseDownPos.x,
        y: this.mouseDownPos.y,
        screenWidth: window.screen.availWidth,
        screenHeight: window.screen.availHeight,
      };

      window.electronAPI.setBound(this.type as any, bound);
      // this.$router.push("/" + this.type);
    },
  },
});
</script>

<style>
</style>