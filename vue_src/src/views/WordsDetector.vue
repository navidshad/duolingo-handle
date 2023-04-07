<template>
  <FrameBorder>
    <Frameheader title="Words Detector">
      <template #actions>
        <v-btn @click="takeScreenShot">Take</v-btn>
      </template>
    </Frameheader>
    <div>Words Detector</div>
    <section>
      <img v-if="imgUrl.length" :src="imgUrl" />
    </section>
  </FrameBorder>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { captureScreenShot } from "@/helpers/screen";

export default defineComponent({
  data() {
    return {
      imgUrl: "",
    };
  },
  methods: {
    async takeScreenShot() {
      this.imgUrl = await window.electronAPI.takeScreenShot();
    },
  },
});
</script>
