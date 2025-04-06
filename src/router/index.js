import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegistrationView.vue'),
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
        meta: {
            requiresAuth: true,
            admin: true
        }
    },
    {
      path: '/users/:userId',
      name: 'userDetails',
      component: () => import('../views/AdminUserDetailsView.vue'),
        },
    {
      path: '/checkin/:poiId',
      component: () => import('../views/CheckinDetailView.vue'),

    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log("Router Guard: Token =", token, "Role =", role); // Debugging

  if (to.meta.requiresAuth) {
    if (!token) {
      console.log("Kein Token vorhanden – Weiterleitung zur Startseite");
      return next({ name: 'home' });
    }

    if (to.name === 'login') {
      console.log("Benutzer ist bereits eingeloggt. Weiterleitung je nach Rolle...");
      console.log(role)
      return role === "ADMIN" ? next({ name: 'about' }) : next({ name: 'dashboard' });
    }

    if (to.meta.admin && role !== "Administrator") {
      console.log("Zugriff verweigert – Kein Admin");
      return next({ name: 'forbidden' });
    }
  }

  // Standard-Fall: Erlaubt die Navigation
  next();
});



export default router
