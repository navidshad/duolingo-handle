<template>
  <v-btn icon="fa-solid fa-language" size="x-small">
    <v-icon :color="isActive ? 'primary' : ''" />
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    isActive: Boolean,
  },
});
</script>

<style></style>
