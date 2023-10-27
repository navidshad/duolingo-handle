<template>
  <div class="w-screen h-screen px-2 py-1 flex flex-col">
    <div class="flex-1 flex justify-between">
      <v-btn
        variant="flat"
        size="x-small"
        prepend-icon="fa fa-eraser"
        @click="activeTool = 'none'"
        :color="activeTool == 'none' ? 'primary' : ''"
      >
        None
      </v-btn>

      <time-counter />
    </div>

    <div v-for="toolset in tools" class="flex space-x-1 h-2/5">
      <v-card
        class="flex-grow-1 h-auto mb-1"
        v-for="(tool, i) of toolset"
        :key="i"
        @click="activeTool = tool.type"
        :color="activeTool == tool.type ? 'primary' : ''"
      >
        <v-card-text class="card flex flex-col justify-between items-center">
          <lord-icon
            class="scale-[1.5] mb-2"
            trigger="hover"
            target=".card"
            :src="tool.lordIcon"
          />
          <div class="text-[8px] scale-[1.3]">
            {{ tool.title }}
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import type { ToolType } from "@/types/base";
import { type BaseEvent, OpenToolEvent } from "@/types/event";
import TimeCounter from "@/components/partials/TimeCounter.vue";

export default defineComponent({
  name: "toolsbox",

  components: {
    TimeCounter,
  },

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
        [
          {
            type: "words-detector",
            icon: "fa fa-w",
            lordIcon: "lord-icons/searching-glasses.json",
            title: "Word",
          },
          {
            type: "speaking",
            icon: "fa fa-microphone-lines",
            lordIcon: "lord-icons/lecturer-female.json",
            title: "Speaking",
          },
          {
            type: "writing-guide",
            icon: "fa fa-w",
            lordIcon: "lord-icons/writing-machine.json",
            title: "Writing",
          },
        ],
        [
          {
            type: "voice-recognition",
            icon: "fa fa-headphones",
            lordIcon: "lord-icons/subwoofer.json",
            title: "Voice",
          },
          {
            type: "conversation",
            icon: "fa fa-microphone-lines",
            lordIcon: "lord-icons/support-service.json",
            title: "Conversation",
          },
          {
            type: "gap-filler",
            icon: "fa fa-microphone-lines",
            lordIcon: "lord-icons/origami.json",
            title: "Gap Filler",
          },
        ],
      ],
    } as {
      activeTool: ToolType;
      lockMap: { [key: string]: boolean };
      tools: {
        type: ToolType;
        icon: string;
        lordIcon: string;
        title: string;
      }[][];
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
        event = new OpenToolEvent({
          toolType: this.activeTool,
        });
      }

      window.electronAPI.sendMessage(event);
    },

    // toggleLock(type: ToolType) {
    //   const isLock = !!this.lockMap[type];
    //   this.lockMap[type] = !isLock;

    //   this.sendLockSignal(type, this.lockMap[type]);
    // },

    // unlockAll() {
    //   // this.tools.forEach((tool) => (this.lockMap[tool.type] = false));
    // },
  },
});
</script>
