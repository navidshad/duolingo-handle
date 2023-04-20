<template>
  <section
    class="flex justify-between items-center w-screen h-12 p-2 pr-3"
    :class="{
      'bg-orange-400': !locked,
      'bg-gray-400': locked,
    }"
  >
    <!-- Title -->
    <div class="text-white font-bold select-none">
      <span>{{ title || "" }}</span>

      <v-btn
        class="mx-4"
        size="x-small"
        :icon="locked ? 'fa-lock' : 'fa fa-lock-open'"
        :disabled="locked"
        @click="sendLockSignal(windowType, true)"
      />
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-1">
      <slot name="actions"></slot>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

export default defineComponent({
  setup() {
    return {
      sendLockSignal: inject("sendLockSignal") as (
        type: string,
        isLocked: boolean
      ) => void,
    };
  },

  computed: {
    windowType() {
      return this.$route.path.replaceAll('/', '');
    },
  },

  props: {
    title: String,
    locked: Boolean,
  },
});
</script>