<script lang="ts">
import { httpClient } from "@/plugins/axios";
import { defineComponent } from "vue";
import { useToast } from "vue-toastification";

export default defineComponent({
  name: "Login",

  data() {
    return {
      token: "",
      isPending: false,
    };
  },

  mounted() {
    window.electronAPI.readFromStore("voucher").then((voucher) => {
      if (voucher) {
        this.token = voucher;
      }
    });
  },

  methods: {
    login() {
      window.electronAPI.writeInStore("voucher", this.token);
      this.$router.push("/choose-exam-type");
    },

    async checkVoucher() {
      this.isPending = true;

      await httpClient
        .post("/voucher/check", { voucher: this.token })
        .then((response) => this.login())
        .finally(() => {
          this.isPending = false;
        });
    },
  },
});
</script>

<template>
  <section
    class="w-screen h-screen flex flex-col justify-center items-center space-x-2"
  >
    <div class="w-96">
      <v-text-field
        v-model="token"
        label="Token"
        placeholder="Enter your token"
      />
    </div>

    <v-btn :loading="isPending" @click="checkVoucher" color="primary"
      >Login</v-btn
    >
  </section>
</template>
