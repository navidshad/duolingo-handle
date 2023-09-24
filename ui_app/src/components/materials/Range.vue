<template>
  <div class="flex range-container">
    <label>{{ label }}</label>
    <div class="ml-1">
      <v-btn :size="size || 'x-small'" @click="add(1)">+</v-btn>
      <v-btn :size="size || 'x-small'" @click="add(-1)">-</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    label: String,
    modelValue: Number,
    size: String,
  },

  data() {
    return {
      range: this.modelValue || 0,
    };
  },

  watch: {
    range() {
      this.$emit("update:modelValue", this.range);
    },
  },

  methods: {
    add(value = 0) {
      this.range += value;
    },
  },
});
</script>

<style scoped>
.range-container {
  min-width: 110px;
}
</style>
