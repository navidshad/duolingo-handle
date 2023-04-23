<template>
  <FrameBorder v-slot="{ locked }">
    <Frameheader ref="header" title="Writing Guide" :locked="locked">
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

      <div
        class="px-5 flex items-center justify-between h-16 bg-white border-b-2"
      >
        <p>
          <span class="mr-10">Words: {{ wordCount }}</span>
          <span>Sentences: {{ sentenceCount }}</span>
        </p>

        <div class="mt-6">
          <v-select label="Type" :items="types" v-model="selectedType" />
        </div>
      </div>
    </Frameheader>

    <!-- Content -->
    <section
      class="w-full h-full flex flex-col"
      :class="{ 'bg-white': answere.length }"
    >
      <!-- Answere -->
      <div class="h-full overflow-y-auto">
        <p v-html="answere" />
      </div>
    </section>
  </FrameBorder>
</template>

<script lang="ts">
import { extractAnnotationsFromScreen } from "@/helpers/screen";
import { defineComponent } from "vue";

// @ts-ignore
import HeaderMixin from "@/mixins/header-hight.js";

export default defineComponent({
  mixins: [HeaderMixin],

  data() {
    return {
      isPending: false,
      isGenerating: false,
      types: ["speaking", "writing"],
      selectedType: "writing",
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

      const [an1] = await extractAnnotationsFromScreen({ y: headerHight });
      this.question = an1.description;

      this.generateAnswere().finally(() => {
        this.isPending = false;
      });
    },

    async generateAnswere() {
      this.isGenerating = true;
      const score = "140";

      const promptTypes = <{ [key: string]: string }>{
        writing: `write esay with at least 100 words for this topic: \n${this.question}`,
        speaking: `create an answere with short lines from this cue speaking card: \n${this.question}`,
      };

      const prompt = promptTypes[this.selectedType];

      this.answere = await window.electronAPI
        .createCompletion(prompt)
        .then((text) => {
          if (this.selectedType == "writing") return text;
          else {
            return text.replaceAll(".", ".<br>");
          }
        });

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
