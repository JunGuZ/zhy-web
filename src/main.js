import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/index.css'; // 引入 Element Plus 样式
import router from './router';
import axios from 'axios';
import store from './store'; // 引入 store
axios.defaults.baseURL = "http://localhost:8080";

const app= createApp(App);
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')