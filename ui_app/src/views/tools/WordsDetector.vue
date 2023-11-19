<template>
  <FrameBorder v-slot="{ locked }">
    <Frameheader ref="header" title="Words Detector" :locked="locked">
      <template #actions>
        <v-btn
          size="x-small"
          icon="fa fa-user-secret"
          variant="text"
          :loading="isPending"
          @click="detect"
        />

        <button-language
          :disabled="!wordAnnotations.length"
          :loading="isTranslating"
          :isActive="showTranslate"
          @click="toggleTranslate"
        />

        <v-btn
          size="x-small"
          icon="fa fa-eraser"
          variant="text"
          @click="clear"
        />
      </template>
    </Frameheader>
    <section class="h-full w-full relative">
      <div
        class="absolute text-center flex justify-center items-center"
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
          class="text-sm p-1 bg-gray-300"
          :class="{
            'bg-green-600': !showTranslate && anotation.isValid,
            'bg-red-600': anotation.isValid == false,
          }"
        >
          <p v-if="showTranslate" class="text-xs">
            {{ translated[anotation.word] || anotation.word }}
          </p>
          <p v-else>{{ anotation.word }}</p>
        </div>
      </div>
    </section>
  </FrameBorder>
</template>

<script lang="ts">
import type { Rectangle } from "@/types/base";
import type { TextAnnotation } from "@/types/vision";
import { defineComponent } from "vue";
import { extractAnnotationsFromScreen } from "@/helpers/screen";

// @ts-ignore
import HeaderMixin from "@/mixins/header-hight";
import { checkValidWord, translateText } from "@/services/ai";

export default defineComponent({
  mixins: [HeaderMixin],

  data() {
    return {
      isPending: false,
      isTranslating: false,
      showTranslate: false,
      wordAnnotations: <
        { word: string; rect: Rectangle; isValid?: boolean }[]
      >[],
      translated: <{ [key: string]: string }>{},
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
        y: headerHight,
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
        const task = checkValidWord(annotation.word).then(
          (isValid) => (annotation.isValid = isValid)
        );
      }

      return Promise.allSettled(tasks);
    },

    toggleTranslate() {
      this.showTranslate = !this.showTranslate;

      if (this.showTranslate) {
        this.isTranslating = true;
        const tasks = [];

        for (const annotation of this.wordAnnotations) {
          if (
            !annotation.isValid ||
            this.translated[annotation.word] != undefined
          )
            continue;

          const task = translateText({
            phrase: annotation.word,
            lang: "fa",
          }).then(([translated]) => {
            this.translated[annotation.word] = translated;
          });

          tasks.push(task);
        }

        Promise.all(tasks).finally(() => (this.isTranslating = false));
      }
    },
  },
});
</script>
