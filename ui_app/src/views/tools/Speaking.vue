<template>
  <FrameBorder>
    <Frameheader ref="header" title="Speaking Guide">
      <template #right-actions>
        <v-btn
          size="x-small"
          icon="fa fa-user-secret"
          variant="text"
          :loading="isPending"
          @click="detect"
        />

        <v-btn
          size="x-small"
          icon="fa fa-arrows-rotate"
          variant="text"
          :disabled="question.length == 0"
          :loading="isGenerating"
          @click="generateAnswere"
        />

        <v-btn
          size="x-small"
          icon="fa fa-eraser"
          variant="text"
          @click="clear"
        />
      </template>

      <template #actions>
        <SimpleSelect class="ml-4" :items="types" v-model="selectedType" />
      </template>

      <div
        class="px-2 flex items-center justify-between h-8 bg-white border-b-2 overflow-x-auto"
      >
        <p :style="{ minWidth: '210px' }" class="text-xs">
          <span class="mr-10">Words: {{ wordCount }}</span>
          <span>Sentences: {{ sentenceCount }}</span>
        </p>

        <v-btn
          size="x-small"
          :disabled="answere.length == 0"
          @click="isSpeeking = !isSpeeking"
        >
          <span v-if="!isSpeeking">Start Speaking</span>
          <span v-else>Stop</span>
        </v-btn>
      </div>
    </Frameheader>

    <!-- Content -->
    <section
      v-if="answere.length"
      class="w-full h-full flex flex-col px-2 pt-1"
      :class="{ 'bg-white': answere.length }"
    >
      <SpeechPresenter v-if="isSpeeking" :text="answere" />

      <!-- Answere -->
      <textarea
        v-else
        v-model="answere"
        :disabled="true"
        :style="{ height: contentHeight + 'px' }"
      />
    </section>
  </FrameBorder>
</template>

<script lang="ts">
import { extractAnnotationsFromScreen } from "@/helpers/screen";
import { defineComponent } from "vue";

// @ts-ignore
import HeaderMixin from "@/mixins/header-hight.js";
import { sleep } from "@/helpers/promise";
import { createCompletion } from "@/services/ai";

export default defineComponent({
  mixins: [HeaderMixin],

  data() {
    return {
      isPending: false,
      isGenerating: false,
      isSpeeking: false,
      types: ["90s", "3mins"],
      selectedType: "90s",
      question: "",
      answere: "",
    };
  },

  computed: {
    wordCount() {
      // @ts-ignore
      const count = this.answere.length ? this.answere.split(" ").length : 0;
      return count;
    },

    sentenceCount() {
      // @ts-ignore
      const count = this.answere.length ? this.answere.split(".").length : 0;
      return count;
    },
  },

  methods: {
    clear() {
      this.answere = "";
    },

    async detect() {
      this.isPending = true;

      // @ts-ignore
      let headerHight = (this.$refs.header.$el as HTMLDivElement).clientHeight;

      await extractAnnotationsFromScreen({ y: headerHight })
        .then(([an1]) => {
          this.question = an1.description;
          return this.generateAnswere();
        })
        .finally(() => {
          this.isPending = false;
        });
    },

    async generateAnswere() {
      this.isGenerating = true;
      const score = "140";

      const prompt = `I have to speek for ${this.selectedType} mins, give me a speech text about this: \n${this.question}`;

      this.answere = await createCompletion({
        prompt,
        model: "gpt-4",
      }).then((text) => text.replaceAll("\n", ""));

      this.isGenerating = false;
    },

    async writeByKeybard() {
      await sleep(2000);
      window.electronAPI.writeByKeyboard(this.answere);
    },
  },
});
</script>

<style scoped>
.available-area {
  width: -webkit-fill-available;
  height: -webkit-fill-available;
}
</style>
