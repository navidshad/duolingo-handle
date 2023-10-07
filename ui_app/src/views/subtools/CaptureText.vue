<template>
  <section
    class="flex justify-center items-center w-screen h-screen relative"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
  >
    <v-progress-circular
      v-if="isPending"
      color="blue"
      indeterminate
      :size="42"
      :width="6"
    />

    <div
      class="absolute rounded border-2 border-yellow-600"
      :style="selectedAreaStyle"
    />

    <div class="absolute w-full h-full bg-black opacity-50" />
  </section>
</template>

<script lang="ts">
import type { WindowType } from "@/types/base";
import { defineComponent } from "vue";
import subtoolMixin from "@/mixins/subtool";
import { extractTextWithCustomBound } from "@/helpers/screen";

type Coordinate = { x: number; y: number };

// TODO:  Add ability to select multiple areas,
//        and pass an array of areas to the parent component.

export default defineComponent({
  mixins: [subtoolMixin],

  data() {
    const data = {
      isPending: false,
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
      if (this.isPending) return;

      this.isTrackingMouse = true;
      this.mousePageP1.x = event.clientX;
      this.mousePageP1.y = event.clientY;
      this.mouseScreenP1.x = event.screenX;
      this.mouseScreenP1.y = event.screenY;

      window.addEventListener("mouseup", this.onMouseUp);
    },

    onMouseMove({ clientX, clientY }: MouseEvent) {
      if (this.isPending) return;
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

      this.onAfterSelectArea();
    },

    onAfterSelectArea() {
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

      this.isPending = true;
      extractTextWithCustomBound(bound)
        .then((text) => {
          try {
            let lines = text.split("\n");

            // join lines without "." at the end to next line.
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].endsWith(".")) continue;
              if (i + 1 >= lines.length) continue;

              lines[i + 1] = lines[i] + " " + lines[i + 1];
              lines[i] = "";
            }

            return lines.filter((line) => line.length > 0).join("\n\n");
          } catch (error) {
            return text;
          }
        })
        .then((text) => {
          this.emitByChannel({ text });
        })
        .finally(() => {
          this.isPending = false;
          this.close();
        });
    },
  },
});
</script>
