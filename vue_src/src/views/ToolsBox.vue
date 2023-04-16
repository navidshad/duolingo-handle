<template>
  <section class="flex justify-center items-center h-screen w-screen">
    <div class="flex flex-col justify-center items-start space-y-2">
      <v-btn
        variant="flat"
        prepend-icon="fa fa-eraser"
        block
        @click="activeTool = 'none'"
        :color="activeTool == 'none' ? 'primary' : ''"
      >
        None
      </v-btn>

      <div
        class="flex w-full justify-between space-x-1"
        v-for="(tool, i) of tools"
        :key="i"
      >
        <v-btn
          variant="outlined"
          :prepend-icon="tool.icon"
          class="w-56"
          @click="activeTool = tool.type"
          :color="activeTool == tool.type ? 'primary' : ''"
        >
          {{ tool.title }}
        </v-btn>

        <v-btn
          size="x-small"
          :icon="lockMap[tool.type] ? 'fa-lock' : 'fa fa-lock-open'"
          :disabled="activeTool !== tool.type"
          @click="toggleLock(tool.type)"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ToolType } from "@/types/base";
import { BaseEvent, RoleEvent, SetIgnoreMouseEvents } from "@/types/event";

export default defineComponent({
  name: "toolsbox",
  data() {
    return {
      activeTool: "none",
      lockMap: {},
      tools: [
        {
          type: "words-detector",
          icon: "fa fa-w",
          title: "Word Detector",
        },
        {
          type: "writing-guide",
          icon: "fa fa-w",
          title: "Writing Guide",
        },
      ],
    } as {
      activeTool: ToolType;
      lockMap: { [key: string]: boolean };
      tools: { type: ToolType; icon: string; title: string }[];
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
      this.unlockAll()

      if (this.activeTool == "none") {
        event = { type: "close-tools" };
      } else {
        event = {
          toolType: this.activeTool,
          type: "open-tool",
        } as RoleEvent;
      }

      window.electronAPI.sendMessage(event);
    },

    toggleLock(type: ToolType) {
      const isLock = !!this.lockMap[type];
      this.lockMap[type] = !isLock;

      window.electronAPI.sendMessage({
        type: "set-ignore-mouse-event",
        toolType: type,
        value: this.lockMap[type],
      } as SetIgnoreMouseEvents);
    },

    unlockAll() {
      this.tools.forEach((tool) => (this.lockMap[tool.type] = false));
    }
  },
});
</script>
