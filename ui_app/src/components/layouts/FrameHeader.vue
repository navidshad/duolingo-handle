<template>
  <div>
    <section
      class="header w-screen h-5 py-3 flex items-center justify-center -mt-1 cursor-pointer border-b-[1px]"
      :class="{
        'bg-white': !locked,
        'bg-gray-400': locked,
      }"
    >
      <!-- Title -->
      <div class="text-gray-700 text-sm select-none">
        <span>{{ title || "" }}</span>
      </div>
    </section>

    <section
      class="flex justify-between items-center w-screen h-10 p-2 pr-3"
      :class="{
        'bg-white': !locked,
        'bg-gray-400': locked,
      }"
    >
      <div class="flex-1"></div>
      <!-- Action Buttons -->
      <div class="flex justify-between items-center space-x-1">
        <v-btn
          v-if="locked !== null"
          class="mx-4"
          size="x-small"
          icon
          variant="text"
          :disabled="locked"
          @click="sendLockSignal(windowType, true)"
        >
          <v-icon color="accent">{{
            locked ? "fa-lock" : "fa fa-lock-open"
          }}</v-icon>
        </v-btn>

        <slot name="actions"></slot>
      </div>

      <div class="flex justify-between items-center space-x-1">
        <slot name="right-actions"></slot>
      </div>
    </section>

    <!-- Sub content -->
    <slot />
  </div>
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

  data() {
    return {
      isMoving: false,
    };
  },

  computed: {
    windowType() {
      return this.$route.path.replaceAll("/", "");
    },
  },

  props: {
    title: String,
    locked: {
      type: Boolean,
      default: null,
    },
  },
});
</script>

<style scoped>
.header {
  -webkit-app-region: drag;
}
</style>
