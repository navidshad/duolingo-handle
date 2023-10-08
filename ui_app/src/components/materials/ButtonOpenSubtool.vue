<template>
  <v-btn :size="size" :icon="icon" :loading="isPending" @click="openSubtool" />
</template>

<script lang="ts">
import type { SubtoolType } from "@/types/base";
import { OpenSubtoolEvent } from "@/types/event";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    subtool: {
      type: String,
      required: true,
      validator: (val: string) => ["capture-text"].includes(val),
    },

    size: {
      type: String,
      default: "x-small",
      validate: (val: string) =>
        ["x-small", "small", "medium", "large"].includes(val),
    },

    icon: {
      type: String,
      default: "",
    },

    props: {},

    channelId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isPending: false,
    };
  },

  mounted() {},

  methods: {
    openSubtool() {
      this.isPending = true;

      const event = new OpenSubtoolEvent({
        channelId: this.channelId,
        subtoolType: this.subtool as SubtoolType,
        props: JSON.stringify(this.props || {}),
      });

      window.electronAPI.sendMessage(event);

      const _this = this;
      window.electronAPI.onMessageByChannel(this.channelId, (data) => {
        _this.isPending = false;
        debugger;
        _this.$emit("onData", data);
      });
    },
  },
});
</script>
