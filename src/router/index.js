import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';  // 确保路径正确
import About from '../components/About.vue'; // 可选的关于页面

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    },
    // 这里可以添加其他路由
    {
        path: '/home',
        name: 'Home',
        component: Home,
    },
    {
        path: '/about',
        name: 'About',
        component: About,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
