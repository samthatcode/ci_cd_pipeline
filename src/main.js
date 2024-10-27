// import './assets/main.css'
import './assets/todo.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import App from './App.vue'
import Pipeline from './Pipeline.vue'
import router from './router'

const app = createApp(Pipeline)

app.use(createPinia())
app.use(router)

app.mount('#app')
