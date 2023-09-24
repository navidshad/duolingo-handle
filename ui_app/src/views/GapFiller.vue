<template>
  <FrameBorder v-slot="{ locked }">
    <Frameheader ref="header" title="Gap Filler" :locked="locked">
      <template #right-actions>
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
    <section
      class="h-full w-full"
      :class="{ 'bg-white': detectedText }"
      ref="content"
    >
      <textarea
        class="w-full"
        :style="{ height: contentHeight + 'px' }"
        v-model="detectedText"
        v-if="detectedText.length && !filledText.length"
      />

      <textarea
        class="w-full"
        :style="{ height: contentHeight + 'px' }"
        v-model="filledText"
        v-else-if="filledText.length"
      />
    </section>
  </FrameBorder>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { extractTextFromScreen } from "@/helpers/screen";

// @ts-ignore
import HeaderMixin from "@/mixins/header-hight.js";
import { createChatCompletion } from "@/services/ai";

export default defineComponent({
  mixins: [HeaderMixin],

  data() {
    return {
      isPending: false,
      isFilling: false,
      // isTranslating: false,
      // showTranslate: false,
      types: ["letter", "word"],
      detectedText: "",
      filledText: "",
    };
  },

  methods: {
    clear() {
      this.filledText = "";
    },

    async detect() {
      this.isPending = true;
      this.detectedText = "";
      this.filledText = "";

      // @ts-ignore
      let headerHight = (this.$refs.header.$el as HTMLDivElement).clientHeight;

      extractTextFromScreen({
        y: headerHight,
      })
        .then((detectedText) => (this.detectedText = detectedText))
        .then(() => {
          // remove spaces before question marks, for example " ?" is "?".
          this.detectedText = this.detectedText.replaceAll(/ \?/g, "?");
        })
        .finally(() => {
          this.isPending = false;
        });
    },

    async fillGaps() {
      this.isFilling = true;

      const systemCharecter = `
        fill empty positions where marked by "?". 
        for example "this is a new wo???" is "this is a new world". 
        then put corrected words inside a [] like "this is a new [world]."
      `;

      this.filledText = await createChatCompletion({
        message: [
          {
            role: "system",
            content: systemCharecter,
          },
          {
            role: "user",
            content: this.detectedText,
          },
        ],
      }).finally(() => (this.isFilling = false));
    },

    addCharActivePositionOfContent(char = "?") {
      // Get the textarea element
      const textarea = (this.$refs.content as HTMLElement).querySelector(
        "textarea",
      ) as HTMLTextAreaElement;

      // Get the cursor position
      const cursorPosition = textarea.selectionStart || 0;

      // Insert the character at the cursor position
      const textBeforeCursor = textarea.value.substring(0, cursorPosition);
      const textAfterCursor = textarea.value.substring(
        cursorPosition,
        textarea.value.length,
      );

      this.detectedText = textBeforeCursor + char + textAfterCursor;

      // Set the cursor position after the inserted character
      textarea.focus();

      setTimeout(() => {
        textarea.selectionStart = cursorPosition + 1;
        textarea.selectionEnd = cursorPosition + 1;
      }, 100);
    },

    toggleTranslate() {
      // this.showTranslate = !this.showTranslate;
      // if (this.showTranslate) {
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
      // }
    },
  },
});
</script>
