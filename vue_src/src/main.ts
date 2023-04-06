import { createApp } from 'vue'
import App from './apps/main.vue'

import '@/assets/styles/main.css';

import fontawesome from './plugins/fontawesome';
import { vuetify } from './plugins/vuetify';

const app = createApp(App);

app.use(fontawesome);
app.use(vuetify);

app.mount('#app')
