<template>
  <FrameBorder class="bg-white">
    <Frameheader ref="header" title="Voice Recognition">
      <template #actions>
        <audio
          v-if="base64Audio"
          class="scale-[0.6]"
          :src="'data:audio/wav;base64,' + base64Audio"
          controls
        />

        <button-record-voice-sox
          v-if="audioRecorderType === 'sox'"
          size="small"
          class="ml-2"
          :start-on-mount="false"
          @on-text="text = $event"
          @onAudioBase64="base64Audio = $event"
          @onStart="base64Audio = text = translatedText = ''"
        />

        <button-record-voice
          v-else-if="audioRecorderType === 'chrome'"
          size="small"
          class="ml-2"
          :start-on-mount="false"
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

      <template #right-actions>
        <v-select
          class="scale-[0.6] mt-5 w-32"
          v-model="audioRecorderType"
          :items="[
            { title: 'Sox Audio', value: 'sox' },
            { title: 'Chrome Audio', value: 'chrome' },
          ]"
          label="Select"
          dense
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
import HeaderMixin from "@/mixins/header-hight";
import SystemInfoMixin from "@/mixins/system-Info";
import { translateText } from "@/services/ai";

export default defineComponent({
  mixins: [HeaderMixin, SystemInfoMixin],

  data() {
    return {
      isTranslating: false,
      showTranslate: false,
      base64Audio: "",
      text: "",
      translatedText: "",
      audioRecorderType: "chrome",
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
