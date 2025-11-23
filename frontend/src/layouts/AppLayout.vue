<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/dashboard" class="flex items-center space-x-3">
                <!-- Ticket Icon -->
                <svg
                  class="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
                <span class="text-xl font-bold text-indigo-600"
                  >TicketFlow</span
                >
              </router-link>
            </div>
            <div class="hidden sm:ml-8 sm:flex sm:items-center sm:space-x-8">
              <router-link
                to="/dashboard"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                active-class="border-indigo-500 text-gray-900"
              >
                Dashboard
              </router-link>
              <router-link
                to="/tickets"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                active-class="border-indigo-500 text-gray-900"
              >
                Tickets
              </router-link>
              <router-link
                to="/tickets/archived"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                active-class="border-indigo-500 text-gray-900"
              >
                Archive
              </router-link>
              <router-link
                v-if="authStore.isAdmin"
                to="/admin/dashboard"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                active-class="border-indigo-500 text-gray-900"
              >
                Admin
              </router-link>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <!-- Profile dropdown -->
            <div class="ml-3 relative">
              <div>
                <button
                  type="button"
                  class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  @click="showUserMenu = !showUserMenu"
                >
                  <span class="sr-only">Open user menu</span>
                  <div
                    class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center"
                  >
                    <span class="text-sm font-medium text-white">
                      {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                </button>
              </div>
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-show="showUserMenu"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  @click="showUserMenu = false"
                >
                  <div class="px-4 py-2 text-sm text-gray-700 border-b">
                    <div class="font-medium">{{ authStore.user?.name }}</div>
                    <div class="text-gray-500">{{ authStore.user?.email }}</div>
                  </div>
                  <router-link
                    to="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </router-link>
                  <button
                    @click="logout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </transition>
            </div>
          </div>
          <div class="-mr-2 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <button
              type="button"
              class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              @click="showMobileMenu = !showMobileMenu"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                class="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div class="sm:hidden" v-show="showMobileMenu">
        <div class="pt-2 pb-3 space-y-1">
          <router-link
            to="/dashboard"
            class="bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            @click="showMobileMenu = false"
          >
            Dashboard
          </router-link>
          <router-link
            to="/tickets"
            class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            @click="showMobileMenu = false"
          >
            Tickets
          </router-link>
          <router-link
            v-if="authStore.isAdmin"
            to="/admin/dashboard"
            class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            @click="showMobileMenu = false"
          >
            Admin
          </router-link>
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <div
                class="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center"
              >
                <span class="text-sm font-medium text-white">
                  {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">
                {{ authStore.user?.name }}
              </div>
              <div class="text-sm font-medium text-gray-500">
                {{ authStore.user?.email }}
              </div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <router-link
              to="/profile"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              @click="showMobileMenu = false"
            >
              Profile Settings
            </router-link>
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page content -->
    <main class="flex-1">
      <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

export default {
  name: "AppLayout",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const showUserMenu = ref(false);
    const showMobileMenu = ref(false);

    const logout = async () => {
      await authStore.logout();
      router.push("/login");
    };

    const closeMenus = () => {
      showUserMenu.value = false;
      showMobileMenu.value = false;
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        closeMenus();
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
      authStore.initializeAuth();
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      authStore,
      showUserMenu,
      showMobileMenu,
      logout,
    };
  },
};
</script>
