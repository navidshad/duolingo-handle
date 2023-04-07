<template>
  <section class="flex justify-between items-center w-screen h-10 bg-orange-400">
	<!-- Title -->
	<div class="pl-2 text-white font-bold"><span>{{ title || '' }}</span></div>

	<!-- Action Buttons -->
	<div class="flex space-x-1">
		<span name="actions"></span>
	</div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		title: String,
	}
})
</script>

<style>

</style>