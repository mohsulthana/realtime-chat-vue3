import "material-design-icons-iconfont/dist/material-design-icons.css";
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
// Vuetify
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, md } from "vuetify/iconsets/md";
import "vuetify/styles";

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: "md",
        aliases,
        sets: {
            md,
        },
    },
});

createApp(App).use(vuetify).mount("#app");
