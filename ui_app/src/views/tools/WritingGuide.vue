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

      <div
        class="py-2 px-2 flex flex-col items-center justify-between bg-white border-b-2 overflow-x-auto"
      >
        <div class="w-full flex items-center justify-between">
          <p :style="{ minWidth: '210px' }">
            <span class="mr-10">Words: {{ wordCount }}</span>
            <span>Sentences: {{ sentenceCount }}</span>
          </p>

          <div class="flex space-x-3">
            <v-btn
              size="x-small"
              :disabled="answere.length == 0"
              @click="writeByKeybard"
            >
              Write by keyboard</v-btn
            >

            <v-btn size="x-small" @click="settings.active = !settings.active">
              <font-awesome-icon icon="fa-solid fa-gear" />
            </v-btn>
          </div>
        </div>

        <div
          class="w-full mt-2 flex items-center space-x-5"
          v-if="settings.active"
        >
          <div class="w-20">
            <v-text-field label="Score" v-model="settings.score" />
          </div>

          <div class="w-28">
            <v-text-field label="Words" v-model="settings.maximumWords" />
          </div>
        </div>
      </div>
    </Frameheader>

    <!-- Content -->
    <section
      v-if="answere.length"
      class="w-full h-full flex flex-col px-2 pt-1"
      :class="{ 'bg-white': answere.length }"
    >
      <!-- Answere -->
      <textarea
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
import { createChatCompletion } from "@/services/ai";

export default defineComponent({
  mixins: [HeaderMixin],

  data() {
    return {
      isPending: false,
      isGenerating: false,
      question: "",
      answere: "",
      settings: {
        active: false,
        score: "110",
        maximumWords: "100",
      },
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

      const sytemCharacter = `
        you should write maximum ${this.settings.maximumWords} words for this topic. 
        consider duolingo score of ${this.settings.score}.
      `;

      this.answere = await createChatCompletion({
        message: [
          {
            role: "system",
            content: sytemCharacter,
          },
          {
            role: "user",
            content: this.question,
          },
        ],
      });

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