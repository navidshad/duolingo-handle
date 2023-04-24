<template>
  <FrameBorder v-slot="{ locked }">
    <Frameheader ref="header" title="Words Detector" :locked="locked">
      <template #actions>
        <v-btn
          size="x-small"
          icon="fa fa-user-secret"
          :loading="isPending"
          @click="detect"
        />

        <v-btn
          size="x-small"
          icon="fa fa-wand-magic-sparkles"
          :loading="isFilling"
          :disabled="!detectedText.length"
          @click="fillGaps"
        />

        <!-- <button-language
          :disabled="true"
          :loading="isTranslating"
          :isActive="showTranslate"
          @click="toggleTranslate"
        /> -->

        <v-btn size="x-small" icon="fa fa-eraser" @click="clear" />
      </template>
    </Frameheader>
    <section class="h-full w-full relative">
      <v-textarea
        v-model="detectedText"
        v-if="detectedText.length && !filledText.length"
        :class="{ 'bg-white': detectedText.length }"
      />

      <v-textarea
        v-model="filledText"
        v-else-if="filledText.length"
        :class="{ 'bg-white': detectedText.length }"
      />
    </section>
  </FrameBorder>
</template>

<script lang="ts">
import { Rectangle } from "@/types/base";
import { TextAnnotation } from "@/types/vision";
import { defineComponent } from "vue";
import { extractAnnotationsFromScreen } from "@/helpers/screen";

// @ts-ignore
import HeaderMixin from "@/mixins/header-hight.js";

export default defineComponent({
  mixins: [HeaderMixin],

  data() {
    return {
      isPending: false,
      isFilling: false,
      isTranslating: false,
      showTranslate: false,
      detectedText: "",
      filledText: "",
    };
  },

  methods: {
    clear() {
      this.detectedText = "";
      this.filledText = "";
    },

    async detect() {
      this.isPending = true;
      this.detectedText = "";
      this.filledText = "";

      // @ts-ignore
      let headerHight = (this.$refs.header.$el as HTMLDivElement).clientHeight;

      extractAnnotationsFromScreen({
        y: headerHight,
      })
        .then(this.onTextDetected)
        .finally(() => {
          this.isPending = false;
        });
    },

    onTextDetected(textAnnotations: TextAnnotation[]) {
      textAnnotations.shift();
      console.log(textAnnotations);

      function sortPolygons(polygons: TextAnnotation[]) {
        // Sort the polygons by their position within the bounding box
        return polygons.sort((poly1, poly2) => {
          const y1min = Math.min(
            ...poly1.boundingPoly.vertices.map((point) => point.y)
          );
          const y2min = Math.min(
            ...poly2.boundingPoly.vertices.map((point) => point.y)
          );
          const y1max = Math.max(
            ...poly1.boundingPoly.vertices.map((point) => point.y)
          );
          const y2max = Math.max(
            ...poly2.boundingPoly.vertices.map((point) => point.y)
          );

          if (y1max < y2min) {
            // poly1 is above poly2
            return -1;
          } else if (y2max < y1min) {
            // poly1 is below poly2
            return 1;
          } else {
            // poly1 and poly2 overlap vertically
            const x1min = Math.min(
              ...poly1.boundingPoly.vertices.map((point) => point.x)
            );
            const x2min = Math.min(
              ...poly2.boundingPoly.vertices.map((point) => point.x)
            );
            const x1max = Math.max(
              ...poly1.boundingPoly.vertices.map((point) => point.x)
            );
            const x2max = Math.max(
              ...poly2.boundingPoly.vertices.map((point) => point.x)
            );

            if (x1max < x2min) {
              // poly1 is to the left of poly2
              return -1;
            } else if (x2max < x1min) {
              // poly1 is to the right of poly2
              return 1;
            } else {
              // poly1 and poly2 overlap horizontally
              return 0;
            }
          }
        });
      }

      this.detectedText = sortPolygons(textAnnotations)
        .map((an) => an.description)
        .join(" ").trim();
    },

    async fillGaps() {
      const prompt = `fill empty positions which are marked by *:\n${this.detectedText}`;
      this.filledText = await window.electronAPI.createCompletion(prompt);
    },

    toggleTranslate() {
      this.showTranslate = !this.showTranslate;

      if (this.showTranslate) {
        // this.isTranslating = true;
        // const tasks = [];
        // for (const annotation of this.wordAnnotations) {
        //   if (
        //     !annotation.isValid ||
        //     this.translated[annotation.word] != undefined
        //   )
        //     continue;
        //   const task = window.electronAPI
        //     .translateText({ phrase: annotation.word, lang: "fa" })
        //     .then(([translated]) => {
        //       this.translated[annotation.word] = translated;
        //     });
        //   tasks.push(task);
        // }
        // Promise.all(tasks).finally(() => (this.isTranslating = false));
      }
    },
  },
});
</script>
