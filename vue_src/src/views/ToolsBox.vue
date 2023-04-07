<template>
  <section class="flex justify-center items-center h-screen w-screen">
    <div class="flex flex-col justify-center items-center space-y-2">
      <v-btn
        variant="flat"
        prepend-icon="fa fa-eraser"
        block
        @click="activeTool = 'none'"
        :color="activeTool == 'none' ? 'primary' : ''"
      >
        None
      </v-btn>

      <v-btn
        variant="flat"
        prepend-icon="fa fa-w"
        block
        @click="activeTool = 'words-detector'"
        :color="activeTool == 'words-detector' ? 'primary' : ''"
      >
        Word Detector
      </v-btn>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ToolType } from "@/types/base";
import { BaseEvent, RoleEvent } from "@/types/event";

export default defineComponent({
  name: "toolsbox",
  data() {
    return {
      activeTool: "none",
    } as {
      activeTool: ToolType;
    };
  },

  watch: {
    activeTool() {
      this.onToolsSelected();
    },
  },

  methods: {
    onToolsSelected() {
      let event!: BaseEvent;

      if (this.activeTool == "none") {
        event = {
          type: "close-tools",
        };
      } else {
        event = {
          toolType: this.activeTool,
          type: "open-tool",
        } as RoleEvent;
      }

      window.electronAPI.sendMessage(event);
    },
  },
});
</script>
