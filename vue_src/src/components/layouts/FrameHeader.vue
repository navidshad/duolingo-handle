<template>
  <section
    class="flex justify-between items-center w-screen h-12 bg-orange-400 p-2 pr-3"
  >
    <!-- Title -->
    <div class="text-white font-bold select-none">
      <span>{{ title || "" }}</span>
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-1">
      <slot name="actions"></slot>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: String,
  },
});
</script>

<style>
</style>