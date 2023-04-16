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
        <v-btn size="x-small" icon="fa fa-eraser" @click="clear" />
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
import { extractAnnotationsFromScreen } from "@/helpers/screen";

export default defineComponent({
  data() {
    return {
      isPending: false,
      wordAnnotations: <
        { word: string; rect: Rectangle; isValid?: boolean }[]
      >[],
    };
  },

  methods: {
    clear() {
      this.wordAnnotations = [];
    },

    async detect() {
      this.isPending = true;
      this.wordAnnotations = [];

      // @ts-ignore
      let headerHight = (this.$refs.header.$el as HTMLDivElement).clientHeight;

      extractAnnotationsFromScreen({
        x: headerHight,
      })
        .then(async (textAnnotations) => this.renderBox(textAnnotations))
        .finally(() => {
          this.isPending = false;
        });
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

      return this.checkWordValidity();
    },

    checkWordValidity() {
      const tasks: Promise<void>[] = [];

      for (const annotation of this.wordAnnotations) {
        const task = window.electronAPI
          .checkValidWord(annotation.word)
          .then((isValid) => (annotation.isValid = isValid));
      }

      return Promise.allSettled(tasks);
    },
  },
});
</script>
