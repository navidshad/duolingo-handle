<script lang="ts">
import { CloseToolEvent, OpenWindowEvent } from "@/types/event";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Login",

  methods: {
    login() {
      this.goToApp();
    },

    goToApp() {
      window.electronAPI.sendMessage(
        new OpenWindowEvent({
          windowType: "tools-box",
        }),
      );

      window.electronAPI.sendMessage(
        new CloseToolEvent({
          id: "login",
        }),
      );
    },
  },
});
</script>

<template>
  <section
    class="w-screen h-screen flex flex-col justify-center items-center space-x-2"
  >
    <div class="w-96">
      <v-text-field label="Token" placeholder="Enter your token" />
    </div>

    <v-btn @click="login" color="primary">Login</v-btn>
  </section>
</template>
