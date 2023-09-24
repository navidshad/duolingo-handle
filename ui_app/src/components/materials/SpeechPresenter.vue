<template>
  <section
    ref="frame"
    class="overflow-hidden w-full text-lg"
    tabindex="0"
    @keyup.space="toggleScroll"
  >
    <p class="whitespace-nowrap">{{ text }}</p>
  </section>
</template>

<script lang="ts">
import { lerp } from "@/helpers/math";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    text: String,
  },

  data() {
    return {
      isScrolling: false,
      currentScrollWidth: 0,
      interval: <any>null,
      startTime: 0,
      elapsed: 0,
      duration: 120 * 1000,
    };
  },

  mounted() {
    this.frame.focus();
  },

  computed: {
    frame() {
      return this.$refs.frame as HTMLElement;
    },

    targetPosition() {
      return this.frame.scrollWidth;
    },
  },

  methods: {
    toggleScroll() {
      if (this.isScrolling) {
        this.isScrolling = false;
        clearInterval(this.interval);
        return;
      }

      this.isScrolling = true;
      this.startTime = Date.now();

      this.interval = setInterval(() => {
        this.elapsed = Date.now() - this.startTime;
        this.onUpdate();
      }, 10);

      // this.frame.scrollWidth
    },

    onUpdate() {
      let t = this.elapsed / this.duration;

      if (t >= 1) {
        this.currentScrollWidth = this.targetPosition;
        clearInterval(this.interval);
      } else {
        this.currentScrollWidth = lerp(0, this.targetPosition, t);
      }

      this.frame.scroll(this.currentScrollWidth, 0);
    },
  },
});
</script>

<style></style>
