import { createApp } from 'vue'
import App from './App.vue'

import '@/assets/styles/main.css';
import components from './components/components';

import fontawesome from './plugins/fontawesome';
import { vuetify } from './plugins/vuetify';
import router from './router'

const app = createApp(App).use(router);

// Register components
Object.keys(components).forEach(key => app.component(key, (components as any)[key]))

app.use(fontawesome);
app.use(vuetify);

app.mount('#app')

window.electronAPI.onMessage((event: any, data: any) => {
	if (data.type !== 'system-info') return
	console.info("System Info");
	console.table(data.info);
});