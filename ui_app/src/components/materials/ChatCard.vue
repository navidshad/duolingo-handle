<template>
  <div
    :style="{ padding: '0px !important' }"
    class="w-full flex"
    :class="[stickToRight ? 'flex-row-reverse' : 'flex-row']"
  >
    <div
      class="flex-1 border-2 border-blue-500 bg-blue-50"
      :class="[$attrs.class, stickToRight ? 'rounded-l-lg' : 'rounded-r-lg']"
    >
      <slot></slot>
    </div>

    <div class="flex flex-col justify-center items-center mx-1">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    stickToRight: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
