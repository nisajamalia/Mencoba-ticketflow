<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-sm text-gray-700">
        Welcome back, {{ authStore.user?.name }}!
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div class="flex flex-wrap gap-4">
            <router-link to="/tickets/create" class="btn-primary">
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Ticket
            </router-link>
            <router-link to="/tickets" class="btn-outline">
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              View All Tickets
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Tickets
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats?.total || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Closed
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats?.closed || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  In Progress
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats?.in_progress || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  High Priority
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ stats?.high_priority || 0 }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Tickets -->
    <div class="bg-white shadow overflow-hidden sm:rounded-md">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Recent Tickets
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Your latest support tickets
        </p>
      </div>

      <div v-if="ticketStore.loading" class="p-6 text-center">
        <div class="spinner mx-auto"></div>
        <p class="mt-2 text-sm text-gray-500">Loading tickets...</p>
      </div>

      <ul v-else-if="recentTickets.length > 0" class="divide-y divide-gray-200">
        <li v-for="ticket in recentTickets" :key="ticket.id">
          <router-link
            :to="`/tickets/${ticket.id}`"
            class="block hover:bg-gray-50 px-4 py-4 sm:px-6"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <span
                    :class="getStatusBadgeClass(ticket.status)"
                    class="badge"
                  >
                    {{ formatStatus(ticket.status) }}
                  </span>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">
                    {{ ticket.title }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ ticket.category?.name }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <span
                  :class="getPriorityBadgeClass(ticket.priority)"
                  class="badge"
                >
                  {{ formatPriority(ticket.priority) }}
                </span>
                <p class="text-sm text-gray-500">
                  {{ formatDate(ticket.created_at) }}
                </p>
              </div>
            </div>
          </router-link>
        </li>
      </ul>

      <div v-else class="p-6 text-center">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No tickets</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by creating a new ticket.
        </p>
        <div class="mt-6">
          <router-link to="/tickets/create" class="btn-primary">
            <svg
              class="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Ticket
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useTicketStore } from "@/stores/tickets";
import { useRoute } from "vue-router";

export default {
  name: "DashboardPage",
  setup() {
    const authStore = useAuthStore();
    const ticketStore = useTicketStore();
    const route = useRoute();
    const stats = ref(null);

    const recentTickets = computed(() => ticketStore.tickets.slice(0, 5));

    const fetchData = async () => {
      try {
        // Fetch recent tickets
        await ticketStore.fetchTickets({
          per_page: 5,
          sort_by: "created_at",
          sort_order: "desc",
        });

        // Fetch stats
        const statsResponse = await ticketStore.fetchTicketStats();
        stats.value = statsResponse.data;
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const getStatusBadgeClass = (status) => {
      const classes = {
        open: "badge-primary",
        in_progress: "badge-warning",
        resolved: "badge-success",
        closed: "badge-secondary",
      };
      return classes[status] || "badge-secondary";
    };

    const getPriorityBadgeClass = (priority) => {
      const classes = {
        low: "badge-success",
        medium: "badge-warning",
        high: "badge-danger",
      };
      return classes[priority] || "badge-secondary";
    };

    const formatStatus = (status) => {
      return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const formatPriority = (priority) => {
      return priority.charAt(0).toUpperCase() + priority.slice(1);
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    onMounted(() => {
      fetchData();
    });

    // Watch for route changes to refresh data when navigating back to dashboard
    watch(() => route.path, (newPath) => {
      if (newPath === '/dashboard') {
        fetchData();
      }
    });

    return {
      authStore,
      ticketStore,
      stats,
      recentTickets,
      fetchData,
      getStatusBadgeClass,
      getPriorityBadgeClass,
      formatStatus,
      formatPriority,
      formatDate,
    };
  },
};
</script>
