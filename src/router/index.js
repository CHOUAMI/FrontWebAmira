// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import MainLayout from '../components/layout/MainLayout.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/DashboardView.vue')
      },
      {
        path: 'projects',
        name: 'Projects',
        component: () => import('../views/projects/ProjectsView.vue')
      },
      {
        path: 'games',
        name: 'Games',
        component: () => import('../views/games/GamesView.vue')
      },
      {
        path: 'websites',
        name: 'Websites',
        component: () => import('../views/websites/WebsitesView.vue')
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('../views/categories/CategoriesView.vue')
      },
      // Admin Routes
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/users/UsersView.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('../views/roles/RolesView.vue'),
        meta: { requiresAdmin: true }
      }
    ]
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('../views/LoginView.vue')
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('../views/RegisterView.vue')
      }
    ]
  },
  // Catch all route for 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login');
    return;
  }

  // Check if route requires admin role
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard');
    return;
  }

  // If user is already authenticated and tries to access login/register
  if (authStore.isAuthenticated && to.path.startsWith('/auth')) {
    next('/dashboard');
    return;
  }

  next();
});

export default router;