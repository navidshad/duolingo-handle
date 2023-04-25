<template>
  <select
    class="border-solid border-2 border-gray-900 rounded-md px-2"
    v-model="selectedItem"
  >
    <option v-for="(item, i) in items" :key="i" :value="item">
      {{ item }}
    </option>
  </select>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    items: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedItem: this.modelValue,
    };
  },

  watch: {
    selectedItem() {
      this.$emit("update:modelValue", this.selectedItem);
    },
  },
});
</script>
  