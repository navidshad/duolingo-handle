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
          icon="fa fa-arrows-rotate"
          :disabled="question.length == 0"
          :loading="isGenerating"
          @click="generateAnswere"
        />
        <v-btn size="x-small" icon="fa fa-eraser" @click="clear" />
      </template>
    </Frameheader>

    <!-- Content -->
    <section class="w-full h-full relative">
      <!-- Statistic -->
      <div
        class="available-area h-10 mx-10 absolute top-0 pt-4"
        :class="{ 'bg-white': answere.length }"
      >
        <p>
          <span class="mr-10">Words: {{ wordCount }}</span>
          <span>Sentences: {{ sentenceCount }}</span>
        </p>
      </div>

      <!-- Answere -->
      <div
        class="available-area border-yellow-500 border-2 absolute m-10"
        :class="{ 'bg-white': answere.length }"
      >
        <p>{{ answere }}</p>
      </div>
    </section>
  </FrameBorder>
</template>

<script lang="ts">
import { extractAnnotationsFromScreen } from "@/helpers/screen";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      isPending: false,
      isGenerating: false,
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

      const [an1] = await extractAnnotationsFromScreen({ y: headerHight + 40 });
      this.question = an1.description;

      this.generateAnswere().finally(() => {
        this.isPending = false;
      });
    },

    async generateAnswere() {
      this.isGenerating = true;
      const score = "140";
      const prompt = `write an duolingo esay with score ${score} with at least 90 words for this topic: \n${this.question}`;

      this.answere = await window.electronAPI.createCompletion(prompt);
      this.isGenerating = false;
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
