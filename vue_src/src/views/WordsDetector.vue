<template>
  <FrameBorder>
    <Frameheader ref="header" title="Words Detector">
      <template #actions>
        <v-btn @click="takeScreenShotAndDetect">Take</v-btn>
      </template>
    </Frameheader>
    <section class="h-full w-full relative">
      <div
        class="absolute bg-blue-600 text-center flex justify-center items-center"
        v-for="(anotation, i) of wordAnnotations"
        :key="i + anotation.word"
        :style="{
          top: anotation.rect.y + 'px',
          left: anotation.rect.x + 'px',
          width: anotation.rect.width + 'px',
          height: anotation.rect.height + 'px',
        }"
      >
        <div
          class="text-lg px-4 py-2"
          :class="{
            'bg-green-600': anotation.isValid,
            'bg-red-600': anotation.isValid == false,
          }"
        >
          {{ anotation.word }}
        </div>
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
      wordAnnotations: <
        { word: string; rect: Rectangle; isValid?: boolean }[]
      >[],
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
      textAnnotations.shift();

      for (const annotation of textAnnotations) {
        if (annotation.boundingPoly.vertices.length > 4) continue;

        const { description, boundingPoly } = annotation;
        const [v1, v2, v3, v4] = boundingPoly.vertices;

        const width = v2.x - v1.x;
        const height = v4.y - v1.y;

        const rect: Rectangle = { ...v1, width, height };

        this.wordAnnotations.push({ word: description, rect });
      }

      this.checkWordValidity();
    },

    async checkWordValidity() {
      const tasks: Promise<void>[] = [];

      for (const annotation of this.wordAnnotations) {
        const task = window.electronAPI
          .checkValidWord(annotation.word)
          .then((isValid) => (annotation.isValid = isValid));
      }

      Promise.all(tasks);
    },
  },
});
</script>
