<template>
  <chat-card class="p-2">
    <h1 v-if="!content?.length">Record the Voice!</h1>
    <p v-else>{{ content }}</p>

    <template #actions>
      <button-record-voice
        size="small"
        :disabled="content?.length"
        @on-text="content = $event"
      />

      <v-btn
        class="my-2"
        size="small"
        variant="text"
        icon="fa fa-remove"
        @click="$emit('remove')"
      />
    </template>
  </chat-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      content: "",
    };
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        if (val !== this.content) this.content = val;
      },
    },

    content(val) {
      this.$emit("update:modelValue", val);
    },
  },

  mounted() {},

  methods: {},
});
</script>
