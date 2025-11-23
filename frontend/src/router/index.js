import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Layouts
import AuthLayout from "@/layouts/AuthLayout.vue";
import AppLayout from "@/layouts/AppLayout.vue";

// Pages
import LoginPage from "@/pages/auth/LoginPage.vue";
import RegisterPage from "@/pages/auth/RegisterPage.vue";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage.vue";

import DashboardPage from "@/pages/DashboardPage.vue";
import TicketsPage from "@/pages/tickets/TicketsPage.vue";
import TicketCreatePage from "@/pages/tickets/TicketCreatePage.vue";
import TicketEditPage from "@/pages/tickets/TicketEditPage.vue";
import TicketDetailPage from "@/pages/tickets/TicketDetailPage.vue";

import ProfilePage from "@/pages/ProfilePage.vue";

import AdminDashboardPage from "@/pages/admin/AdminDashboardPage.vue";
import AdminUsersPage from "@/pages/admin/AdminUsersPage.vue";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        component: LoginPage,
        meta: { requiresGuest: true },
      },
      {
        path: "/register",
        name: "register",
        component: RegisterPage,
        meta: { requiresGuest: true },
      },
      {
        path: "/forgot-password",
        name: "forgot-password",
        component: ForgotPasswordPage,
        meta: { requiresGuest: true },
      },
    ],
  },
  {
    path: "/",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: DashboardPage,
      },
      {
        path: "/tickets",
        name: "tickets",
        component: TicketsPage,
      },
      {
        path: "/tickets/archived",
        name: "tickets-archived",
        component: () => import("@/pages/tickets/ArchivedTicketsPage.vue"),
      },
      {
        path: "/tickets/create",
        name: "ticket-create",
        component: TicketCreatePage,
      },
      {
        path: "/tickets/:id",
        name: "ticket-detail",
        component: TicketDetailPage,
        props: true,
      },
      {
        path: "/tickets/:id/edit",
        name: "ticket-edit",
        component: TicketEditPage,
        props: true,
      },
      {
        path: "/profile",
        name: "profile",
        component: ProfilePage,
      },
      // Admin routes
      {
        path: "/admin",
        meta: { requiresAdmin: true },
        children: [
          {
            path: "/admin/dashboard",
            name: "admin-dashboard",
            component: AdminDashboardPage,
          },
          {
            path: "/admin/users",
            name: "admin-users",
            component: AdminUsersPage,
          },
          {
            path: "/admin/categories",
            name: "admin-categories",
            component: AdminCategoriesPage,
          },
        ],
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/pages/NotFoundPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Initialize auth if token exists but user is not loaded
  if (authStore.token && !authStore.user && !authStore.loading) {
    await authStore.fetchUser();
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
    return;
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/dashboard");
    return;
  }

  // Check if route requires admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next("/dashboard");
    return;
  }

  next();
});

export default router;
