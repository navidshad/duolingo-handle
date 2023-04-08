<template>
  <FrameBorder>
    <Frameheader ref="header" title="Words Detector">
      <template #actions>
        <v-btn @click="takeScreenShot">Take</v-btn>
      </template>
    </Frameheader>
    <section>
      <img v-if="imgUrl.length" :src="imgUrl" />
    </section>
  </FrameBorder>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      imgUrl: "",
    };
  },
  methods: {
    async takeScreenShot() {
      // @ts-ignore
      let headerHight = (this.$refs.header.$el as HTMLDivElement).clientHeight;

      const base64 = await window.electronAPI.takeScreenShot({
        y: headerHight,
      });

      const textAnnotations = await window.electronAPI.detectTextFromImage(
        base64
      );

      console.log(textAnnotations);
    },
  },
});
</script>
