<template>
  <FrameBorder v-slot="{ locked }" class="bg-white">
    <Frameheader ref="header" title="Voice Recognition" :locked="locked">
      <template #actions>
        <button-record-voice
          size="small"
          class="ml-2"
          start-on-mount
          @on-text="text = $event"
        />

        <button-language
          :disabled="!text.length"
          :loading="isTranslating"
          :isActive="showTranslate"
          @click="toggleTranslate"
        />
      </template>
    </Frameheader>

    <section>
      <p v-if="showTranslate && translatedText.length">{{ translatedText }}</p>
      <p v-else>{{ text }}</p>
    </section>
  </FrameBorder>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// @ts-ignore
import HeaderMixin from "@/mixins/header-hight.js";
import { translateText } from "@/services/ai";

export default defineComponent({
  mixins: [HeaderMixin],

  data() {
    return {
      isTranslating: false,
      showTranslate: false,
      text: "",
      translatedText: "",
    };
  },

  mounted() {},

  methods: {
    toggleTranslate() {
      this.showTranslate = !this.showTranslate;

      if (this.showTranslate && !this.translatedText.length) {
        this.isTranslating = true;
        translateText({ phrase: this.text, lang: "fa" })
          .then(([translated]) => {
            this.translatedText = translated;
          })
          .finally(() => (this.isTranslating = false));
      }
    },
  },
});
</script>
