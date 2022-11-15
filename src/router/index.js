import Vue from 'vue';
import VueRouter from 'vue-router';
import AppHeader from '../components/AppHeader.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    components: {
      header: AppHeader,
      default: () => import('../views/Home.vue'),
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    components: {
      header: AppHeader,
      default: () => import('../views/Dashboard/Index.vue'),
    },
  },
  {
    path: '/login',
    name: 'Login',
    components: {
      header: AppHeader,
      default: () => import('../views/Login.vue'),
    },
  },
  {
    path: '/logout',
    name: 'Logout',
    components: {
      header: AppHeader,
      default: () => import('../views/Logout.vue'),
    },
  },
  {
    path: '/exam/:id/',
    name: 'Exam',
    components: {
      header: AppHeader,
      default: () => import('../views/Exam/Index.vue'),
    },
  },
  {
    path: '/exam/:id/edit',
    components: {
      header: AppHeader,
      default: () => import('../views/Exam/Edit.vue'),
    },
  },
  {
    path: '/results/:id',
    components: {
      header: AppHeader,
      default: () => import('../views/Result/Index.vue'),
    },
  },
  {
    path: '/exam/:id/results',
    components: {
      header: AppHeader,
      default: () => import('../views/Exam/Results.vue'),
    },
  },
  {
    path: '/exam/:id/live',
    components: {
      header: AppHeader,
      default: () => import('../views/Exam/Live.vue'),
    },
  },
  {
    path: '/features',
    components: {
      header: AppHeader,
      default: () => import('../views/Features.vue'),
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// eslint-disable-next-line consistent-return
router.beforeEach((to, from, next) => {
  const loggedIn = !!localStorage.getItem('loggedIn');
  if (to.path === '/login' && loggedIn) {
    return next('/dashboard');
  }
  if (to.path === '/dashboard' && !loggedIn) {
    return next('/login');
  }
  next();
});

export default router;
