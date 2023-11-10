<script lang="ts">
import { httpClient } from "@/plugins/axios";
import type { IntentionMode } from "@/types/base";
import { CloseToolEvent, OpenWindowEvent } from "@/types/event";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      type: "practice",
      isRedeeming: false,
      runtimeModes: <{ type: IntentionMode; lordIcon: string }[]>[
        { type: "practice", lordIcon: "lord-icons/karate.json" },
        { type: "exam", lordIcon: "lord-icons/business-card.json" },
      ],
    };
  },

  computed: {
    totalRemainingExams() {
      return this.$route.query.totalRemainingExams;
    },
  },

  methods: {
    async prepareToContinue() {
      if (this.type === "exam") {
        try {
          await this.redeem();
        } catch (error) {
          this.isRedeeming = false;
          return;
        }
      }

      this.startToolBox();
    },

    async redeem() {
      this.isRedeeming = true;

      const voucher = await window.electronAPI.readFromStore("voucher");

      await httpClient.post("/voucher/redeem", { voucher }).finally(() => {
        this.isRedeeming = false;
      });
    },

    startToolBox() {
      window.electronAPI.writeInStore("runtimeMode", this.type);

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
    <section class="w-80">
      <h1 class="text-2xl">
        As which <span class="text-green-600 font-bold">mode</span> do you want
        to use the App?
      </h1>
      <p class="text-xs mt-2">
        You have
        <span class="text-green-600 font-bold"
          >{{ totalRemainingExams }} remaining voucher</span
        >
        that would be used each time you take exam mode.
      </p>
    </section>
    <section class="flex justify-center items-center space-x-2">
      <div
        v-for="(mode, i) in runtimeModes"
        :key="i"
        :class="[
          'border-2 ',
          { 'border-white': type !== mode.type },
          { 'border-green-500': type === mode.type },
        ]"
        @click="type = mode.type"
      >
        <v-card
          width="150"
          height="200"
          variant="text"
          class="card d-flex flex-col justify-center items-center hover:shadow-lg cursor-pointer"
        >
          <lord-icon
            class="scale-[3] mb-10"
            trigger="hover"
            target=".card"
            :src="mode.lordIcon"
          />

          <h3>{{ mode.type.toUpperCase() }}</h3>
        </v-card>
      </div>
    </section>
    <section class="w-80">
      <v-btn
        :loading="isRedeeming"
        variant="text"
        block
        @click="prepareToContinue"
      >
        Continue
      </v-btn>
    </section>
  </div>
</template>
