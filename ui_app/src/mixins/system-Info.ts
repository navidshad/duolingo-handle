import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      // 'aix','darwin','freebsd','linux','openbsd','sunos','win32'
      platform: "",
    };
  },

  computed: {
    isDarwin() {
      return this.platform === "darwin";
    },
    isWindows() {
      return this.platform === "win32";
    },
  },

  mounted() {
    window.electronAPI
      // electron_app/src/statics.ts
      .readFromStore("systeminfo_platform")
      .then((data) => (this.platform = data));
  },
});
