<template>
  <section
    class="w-screen h-screen bg-gray-900 opacity-30 relative"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
  >
    <div
      class="absolute rounded border-2 border-yellow-600"
      :style="selectedAreaStyle"
    />
  </section>
</template>

<script lang="ts">
import { WindowType } from "@/types/base";
import { defineComponent } from "vue";

type Coordinate = { x: number; y: number };

export default defineComponent({
  data() {
    const data = {
      isTrackingMouse: false,
      mousePageP1: <Coordinate>{ x: 0, y: 0 },
      mouseScreenP1: <Coordinate>{ x: 0, y: 0 },
      mouseScreenP2: <Coordinate>{ x: 0, y: 0 },
      selectedAreaStyle: <any>{
        width: 0,
        height: 0,
        top: 0,
        left: 0,
      },
    };

    return data;
  },

  computed: {
    type() {
      return this.$route.query["type"] as WindowType;
    },
  },

  methods: {
    onMouseDown(event: MouseEvent) {
      this.isTrackingMouse = true;
      this.mousePageP1.x = event.clientX;
      this.mousePageP1.y = event.clientY;
      this.mouseScreenP1.x = event.screenX;
      this.mouseScreenP1.y = event.screenY;

      window.addEventListener("mouseup", this.onMouseUp);
    },

    onMouseMove({ clientX, clientY }: MouseEvent) {
      if (!this.isTrackingMouse) return;

      const width = Math.abs(this.mousePageP1.x - clientX);
      const height = Math.abs(this.mousePageP1.y - clientY);

      this.selectedAreaStyle = {
        width: width + "px",
        height: height + "px",
        top: this.mousePageP1.y + "px",
        left: this.mousePageP1.x + "px",
      };
    },

    onMouseUp(event: MouseEvent) {
      this.isTrackingMouse = false;
      window.removeEventListener("mouseup", this.onMouseUp);

      this.mouseScreenP2.x = event.screenX;
      this.mouseScreenP2.y = event.screenY;

      this.sendResizeSignal();
    },

    sendResizeSignal() {
      const width = Math.abs(this.mouseScreenP1.x - this.mouseScreenP2.x);
      const height = Math.abs(this.mouseScreenP1.y - this.mouseScreenP2.y);

      if (width < 50 || height < 50) return;

      const bound = {
        width,
        height,
        x: this.mouseScreenP1.x,
        y: this.mouseScreenP1.y,
        screenWidth: window.screen.availWidth,
        screenHeight: window.screen.availHeight,
      };

      window.electronAPI.setBound(this.type as any, bound);
      this.$router.push("/" + this.type);
    },
  },
});
</script>

<style></style>
