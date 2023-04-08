<template>
  <FrameBorder>
    <Frameheader ref="header" title="Words Detector">
      <template #actions>
        <v-btn @click="takeScreenShotAndDetect">Take</v-btn>
      </template>
    </Frameheader>
    <section class="h-full w-full relative">
      <div
        class="absolute bg-blue-600 text-center"
        v-for="(anotation, i) of wordAnnotations"
        :key="i + anotation.word"
        :style="{
          top: anotation.rect.y + 'px',
          left: anotation.rect.x + 'px',
          width: anotation.rect.width + 'px',
          height: anotation.rect.height + 'px',
        }"
      >
        <span>{{ anotation.word }}</span>
      </div>
    </section>
  </FrameBorder>
</template>

<script lang="ts">
import { Rectangle } from "@/types/base";
import { TextAnnotation } from "@/types/vision";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      wordAnnotations: <{ word: string; rect: Rectangle }[]>[],
    };
  },
  methods: {
    async takeScreenShotAndDetect() {
      this.wordAnnotations = [];

      // @ts-ignore
      let headerHight = (this.$refs.header.$el as HTMLDivElement).clientHeight;

      const base64 = await window.electronAPI.takeScreenShot({
        y: headerHight,
      });

      const textAnnotations = await window.electronAPI.detectTextFromImage(
        base64
      );

      this.renderBox(textAnnotations);

      console.log(textAnnotations);
    },

    renderBox(textAnnotations: TextAnnotation[]) {
      const wordAnnotations = textAnnotations.filter(
        (a) => !a.description.includes(" ")
      );

      for (const annotation of wordAnnotations) {
        if (annotation.boundingPoly.vertices.length > 4) continue;

        const { description, boundingPoly } = annotation;
        const [v1, v2, v3, v4] = boundingPoly.vertices;

        const width = v2.x - v1.x;
        const height = v4.y - v1.y;

        const rect: Rectangle = { ...v1, width, height };

        this.wordAnnotations.push({ word: description, rect });
      }
    },
  },
});
</script>
