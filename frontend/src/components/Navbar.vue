<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link
              to="/dashboard"
              class="text-xl font-bold text-primary-600"
            >
              Ticketing System
            </router-link>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              to="/dashboard"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
              :class="
                $route.path === '/dashboard'
                  ? 'border-primary-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              Dashboard
            </router-link>
            <router-link
              to="/tickets"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
              :class="
                $route.path.startsWith('/tickets')
                  ? 'border-primary-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              Tickets
            </router-link>
            <router-link
              v-if="authStore.user?.role === 'admin'"
              to="/admin/dashboard"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
              :class="
                $route.path.startsWith('/admin')
                  ? 'border-primary-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              Admin
            </router-link>
          </div>
        </div>

        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <!-- Create Ticket Button -->
          <router-link
            to="/tickets/create"
            class="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-medium mr-4"
          >
            Create Ticket
          </router-link>

          <!-- Profile dropdown -->
          <div class="ml-3 relative" ref="profileDropdown">
            <div>
              <button
                @click.stop="toggleProfileMenu"
                class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                id="user-menu-button"
                :aria-expanded="showProfileMenu"
                aria-haspopup="true"
                type="button"
              >
                <span class="sr-only">Open user menu</span>
                <div
                  class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center"
                >
                  <span class="text-sm font-medium text-white">
                    {{ authStore.user?.name?.charAt(0) || "R" }}
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
                v-show="showProfileMenu"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                <div class="px-4 py-2 text-sm text-gray-700 border-b">
                  <div class="font-medium">{{ authStore.user?.name }}</div>
                  <div class="text-gray-500">{{ authStore.user?.email }}</div>
                </div>
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  @click="showProfileMenu = false"
                >
                  Profile Settings
                </router-link>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="-mr-2 flex items-center sm:hidden">
          <button
            @click.stop="toggleMobileMenu"
            class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            aria-controls="mobile-menu"
            :aria-expanded="showMobileMenu"
            type="button"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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
    <div v-show="showMobileMenu" class="sm:hidden" id="mobile-menu">
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          to="/dashboard"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
          :class="
            $route.path === '/dashboard'
              ? 'bg-primary-50 border-primary-500 text-primary-700'
              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
          "
          @click="showMobileMenu = false"
        >
          Dashboard
        </router-link>
        <router-link
          to="/tickets"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
          :class="
            $route.path.startsWith('/tickets')
              ? 'bg-primary-50 border-primary-500 text-primary-700'
              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
          "
          @click="showMobileMenu = false"
        >
          Tickets
        </router-link>
        <router-link
          v-if="authStore.user?.role === 'admin'"
          to="/admin/dashboard"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
          :class="
            $route.path.startsWith('/admin')
              ? 'bg-primary-50 border-primary-500 text-primary-700'
              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
          "
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
                {{ authStore.user?.name?.charAt(0) || "R" }}
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
            class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "Navbar",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const showProfileMenu = ref(false);
    const showMobileMenu = ref(false);
    const profileDropdown = ref(null);

    const toggleProfileMenu = () => {
      showProfileMenu.value = !showProfileMenu.value;
      showMobileMenu.value = false; // Close mobile menu when opening profile
    };

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value;
      showProfileMenu.value = false; // Close profile menu when opening mobile
    };

    const logout = async () => {
      try {
        showProfileMenu.value = false;
        showMobileMenu.value = false;
        await authStore.logout();
        router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (
        profileDropdown.value &&
        !profileDropdown.value.contains(event.target)
      ) {
        showProfileMenu.value = false;
      }
      // Close mobile menu when clicking outside
      if (
        !event.target.closest("#mobile-menu") &&
        !event.target.closest('button[aria-controls="mobile-menu"]')
      ) {
        showMobileMenu.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      authStore,
      showProfileMenu,
      showMobileMenu,
      profileDropdown,
      toggleProfileMenu,
      toggleMobileMenu,
      logout,
    };
  },
};
</script>
