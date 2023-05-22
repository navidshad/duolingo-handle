<template>
	<section ref="frame" class="overflow-auto w-full">
		<p class="whitespace-nowrap">{{ text }}</p>
	</section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    text: String,
  },

  computed: {
	frame() {
		return this.$refs.frame as HTMLElement
	}
  },

  methods: {
	scroll () {
		this.frame.scrollWidth
	}
  }
});
</script>

<style>
</style>