// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '../views/UserLogin.vue';
import UserRegister from '../views/UserRegister.vue';
import NoteEditor from '../views/NoteEditor.vue';

const routes = [
    {
        path: '/',
        name: 'UserLogin',
        component: UserLogin
    },
    {
        path: '/register',
        name: 'UserRegister',
        component: UserRegister
    },
    {
        path: '/notes',
        name: 'NoteEditor',
        component: NoteEditor,
        // meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// Навигационная защита
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('user');

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;
