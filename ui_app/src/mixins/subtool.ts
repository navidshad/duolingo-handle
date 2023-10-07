import { defineComponent } from "vue";
import { CloseToolEvent } from "@/types/event";
import type { ToolType } from "@/types/base";

export default defineComponent({
  computed: {
    channelId() {
      return this.$route.query["channelId"] as ToolType;
    },

    props() {
      if (this.$route.query["props"]) {
        return JSON.parse(this.$route.query["props"] as string);
      } else return {};
    },
  },

  methods: {
    close() {
      window.electronAPI.sendMessage(
        new CloseToolEvent({ id: this.channelId })
      );
    },

    emitByChannel(data: any) {
      window.electronAPI.sendMessageByChannel(this.channelId, data);
    },
  },
});
