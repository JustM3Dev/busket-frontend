import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import feathersClient from '@/feathers-client';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'home',
    meta: { requiresAuth: false },
    component: Home,
  },
  {
    path: '/auth/signup',
    name: 'signup',
    meta: { requiresAuth: false },
    component: () => import('../views/Auth/Signup.vue'),
  },
  {
    path: '/auth/logout',
    name: 'logout',
    meta: { requiresAuth: false },
    component: () => import('../views/Auth/Logout.vue'),
  },
  {
    path: '/auth/login',
    name: 'login',
    meta: { requiresAuth: false },
    component: () => import('../views/Auth/Login.vue'),
  },
  {
    path: '/auth/reset',
    name: 'reset password',
    meta: { requiresAuth: false },
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/ResetLogin.vue'),
  },
  {
    path: '/mylist',
    name: 'mylist',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/ResetLogin.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  console.log('[Router]', to, from);

  // Authentication
  if (!feathersClient.authentication.authenticated) {
    await feathersClient.authenticate().then((user: any) => {
      feathersClient.authentication.app.set('auth', user);
    }).catch((err: any) => {
      console.log(`[Auth] Not authenticated. This page requires auth: ${to.meta?.requiresAuth ? 'yes' : 'no'}`);
      if (!err.data?.reason && to.meta?.requiresAuth) router.replace({ name: 'login', query: { redirect: to.path } });
    });
  }
  next();
});

export default router;
