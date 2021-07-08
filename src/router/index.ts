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
    component: () => import('@/views/Auth/Signup.vue'),
  },
  {
    path: '/auth/login',
    name: 'login',
    meta: { requiresAuth: false },
    component: () => import('@/views/Auth/Login.vue'),
  },
  {
    path: '/me/overview',
    name: 'list overview',
    meta: { requiresAuth: true },
    component: () => import('@/views/ListOverview.vue'),
  },
  {
    path: '/me/list/:listId',
    name: 'list detail',
    meta: { requiresAuth: true },
    props: true,
    component: () => import('@/views/ListDetail.vue'),
  },
  {
    path: '*',
    name: '404',
    meta: { requiresAuth: false },
    component: () => import('@/views/NotFound.vue'),
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
    await feathersClient.authenticate().then((user) => {
      feathersClient.authentication.app.set('auth', user);
    }).catch((err) => {
      console.log(`[Auth] Not authenticated. This page requires auth: ${to.meta?.requiresAuth ? 'yes' : 'no'}`);
      if (!err.data?.reason && to.meta?.requiresAuth) router.replace({ name: 'login', query: { redirect: to.path } });
    });
  }
  next();
});

export default router;
