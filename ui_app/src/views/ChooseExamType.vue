<script lang="ts">
import { IntentionMode } from "@/types/base";
import { CloseToolEvent, OpenWindowEvent } from "@/types/event";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      runtimeModes: <{ type: IntentionMode; icon: string[] }[]>[
        { type: "practice", icon: ["fas", "ice-cream"] },
        { type: "exam", icon: ["fas", "face-grin-beam"] },
      ],
    };
  },

  methods: {
    onSelectMode(type: IntentionMode) {
      window.electronAPI.writeInStore("runtimeMode", type);

      window.electronAPI.sendMessage(
        new OpenWindowEvent({
          windowType: "tools-box",
        })
      );

      window.electronAPI.sendMessage(
        new CloseToolEvent({
          // Since this page came up from login page, the close id is login.
          id: "login",
        })
      );
    },
  },
});
</script>

<template>
  <div
    class="w-screen h-screen flex flex-col justify-center items-center space-y-10"
  >
    <h1 class="text-2xl w-80">As which type do you want to use the App?</h1>
    <section class="flex justify-center items-center space-x-2">
      <v-card
        v-for="(mode, i) in runtimeModes"
        :key="i"
        width="150"
        height="200"
        class="d-flex flex-col justify-center items-center hover:shadow-lg cursor-pointer"
        @click="onSelectMode(mode.type)"
      >
        <font-awesome-icon :icon="mode.icon" size="4x" class="mb-6" />
        <h3>{{ mode.type.toUpperCase() }}</h3>
      </v-card>
    </section>
  </div>
</template>
