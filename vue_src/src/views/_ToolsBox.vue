<template>
  <section class="flex justify-center items-center h-screen">
    <div class="flex justify-center items-center space-x-2">
      <v-btn
        variant="flat"
        size="x-small"
        prepend-icon="fa fa-eraser"
        @click="activeTool = 'none'"
        :color="activeTool == 'none' ? 'primary' : ''"
      >
        None
      </v-btn>

      <div
        class="flex w-full justify-between"
        v-for="(tool, i) of tools"
        :key="i"
      >
        <v-btn
          variant="outlined"
          :prepend-icon="tool.icon"
          size="x-small"
          @click="activeTool = tool.type"
          :color="activeTool == tool.type ? 'primary' : ''"
        >
          {{ tool.title }}
        </v-btn>

        <v-btn
          size="x-small"
          :disabled="activeTool !== tool.type"
          @click="toggleLock(tool.type)"
        >
          <v-icon
            :icon="lockMap[tool.type] ? 'fa-lock' : 'fa fa-lock-open'"
          ></v-icon>
        </v-btn>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import { ToolType } from "@/types/base";
import { BaseEvent, RoleEvent, SetIgnoreMouseEvents } from "@/types/event";

export default defineComponent({
  name: "toolsbox",

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
      activeTool: "none",
      lockMap: {},
      tools: [
        {
          type: "words-detector",
          icon: "fa fa-w",
          title: "Word",
        },
        {
          type: "writing-guide",
          icon: "fa fa-w",
          title: "Writing",
        },
        {
          type: "voice-recognition",
          icon: "fa fa-headphones",
          title: "Voice",
        },
        {
          type: "gap-filler",
          icon: "fa fa-microphone-lines",
          title: "Gap",
        },
        {
          type: "conversation",
          icon: "fa fa-microphone-lines",
          title: "Conversation",
        },
        {
          type: "speaking",
          icon: "fa fa-microphone-lines",
          title: "Speaking",
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
      this.unlockAll();

      if (this.activeTool == "none") {
        event = {
          type: "close-tools",
        };
      } else {
        event = new RoleEvent({
          toolType: this.activeTool,
        });
      }

      window.electronAPI.sendMessage(event);
    },

    toggleLock(type: ToolType) {
      const isLock = !!this.lockMap[type];
      this.lockMap[type] = !isLock;

      this.sendLockSignal(type, this.lockMap[type]);
    },

    unlockAll() {
      this.tools.forEach((tool) => (this.lockMap[tool.type] = false));
    },
  },
});
</script>
