// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, fa } from "vuetify/iconsets/fa-svg";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#5BB318",
          secondary: "#2192FF",
          accent: "#7DCE13",
        },
      },
    },
  },
  icons: {
    defaultSet: "fa",
    aliases,
    sets: {
      fa,
    },
  },
});
