import { createApp } from 'vue'
import App from './App.vue'

import '@/assets/styles/main.css';

import fontawesome from './plugins/fontawesome';
import { vuetify } from './plugins/vuetify';
import router from './router'

const app = createApp(App).use(router);

app.use(fontawesome);
app.use(vuetify);

app.mount('#app')

console.log(location.href.toString());