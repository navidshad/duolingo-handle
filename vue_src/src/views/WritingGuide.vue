<template>
  <FrameBorder v-slot="{ locked }">
    <Frameheader ref="header" title="Writing Guide" :locked="locked">
      <template #right-actions>
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

      <template #actions>
        <SimpleSelect class="ml-4" :items="types" v-model="selectedType" />
      </template>

      <div
        class="px-2 flex items-center justify-between h-8 bg-white border-b-2 overflow-x-auto"
      >
        <p :style="{ minWidth: '210px' }">
          <span class="mr-10">Words: {{ wordCount }}</span>
          <span>Sentences: {{ sentenceCount }}</span>
        </p>

        <simple-range v-model="fontSize" label="Font" />
        <simple-range v-model="lineHeight" label="Line" class="mr-4" />
      </div>
    </Frameheader>

    <!-- Content -->
    <section
      v-if="answere.length"
      class="w-full h-full flex flex-col"
      :class="{ 'bg-white': answere.length }"
      :style="{ fontSize: fontSize + 'px', lineHeight: lineHeight + 'px' }"
    >
      <!-- Answere -->
      <textarea
        v-model="answere"
        :disabled="true"
        :style="{ height: contentHeight + 'px' }"
      ></textarea>
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
      fontSize: 18,
      lineHeight: 28,
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
        writing: `write esay maximum 100 words for this topic: \n${this.question}`,
        speaking: `create an answere with short lines from this cue speaking card: \n${this.question}`,
      };

      const prompt = promptTypes[this.selectedType];

      this.answere = await window.electronAPI
        .createCompletion(prompt, "text-curie-001")
        .then((text) => text.replaceAll("\n", ""))
        .then((text) => {
          if (this.selectedType == "writing") return text;
          else {
            return text.replaceAll(".", ".\n");
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
