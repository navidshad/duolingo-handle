<template>
  <FrameBorder class="bg-white">
    <Frameheader ref="header" title="Voice Recognition">
      <template #actions>
        <audio
          v-if="base64Audio"
          class="flex-1 scale-[0.6]"
          :src="'data:audio/mpeg;base64,' + base64Audio"
          controls
        />

        <button-record-voice
          size="small"
          class="ml-2"
          start-on-mount
          @on-text="text = $event"
          @onAudioBase64="base64Audio = $event"
          @onStart="base64Audio = text = translatedText = ''"
        />

        <button-language
          :disabled="!text.length"
          :loading="isTranslating"
          :isActive="showTranslate"
          @click="toggleTranslate"
        />
      </template>
    </Frameheader>

    <section class="px-2">
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
      base64Audio: "",
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
