import { createApp } from 'vue'
import ToolsBox from './apps/ToolsBox.vue'

import '@/assets/styles/main.css';

import fontawesome from './plugins/fontawesome';
import { vuetify } from './plugins/vuetify';

const app = createApp(ToolsBox);

app.use(fontawesome);
app.use(vuetify);

app.mount('#app')
