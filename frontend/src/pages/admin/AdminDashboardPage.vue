<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <!-- Stats Cards -->
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
                      {{ stats.totalTickets }}
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
                      Open Tickets
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats.openTickets }}
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Resolved Tickets
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats.resolvedTickets }}
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
                    class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center"
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
                        d="M12 4.354a4 4 0 110 5.292V21a1 1 0 01-2 0v-2.764a4 4 0 110-5.292V4.354z"
                      />
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Total Users
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats.totalUsers }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Tickets -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Recent Tickets
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              Latest ticket submissions
            </p>
          </div>
          <ul class="divide-y divide-gray-200">
            <li
              v-for="ticket in recentTickets"
              :key="ticket.id"
              class="px-4 py-4 sm:px-6"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <span
                      :class="getStatusClass(ticket.status)"
                      class="px-2 py-1 text-xs font-medium rounded-full"
                    >
                      {{ ticket.status }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-900">
                      {{ ticket.title }}
                    </p>
                    <p class="text-sm text-gray-500">by {{ ticket.user }}</p>
                  </div>
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatDate(ticket.created_at) }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "AdminDashboardPage",
  components: {
    Navbar,
  },
  setup() {
    const stats = ref({
      totalTickets: 0,
      openTickets: 0,
      resolvedTickets: 0,
      totalUsers: 0,
    });

    const recentTickets = ref([]);

    const loadStats = async () => {
      // Mock data for demo
      stats.value = {
        totalTickets: 156,
        openTickets: 45,
        resolvedTickets: 111,
        totalUsers: 23,
      };
    };

    const loadRecentTickets = async () => {
      // Mock data for demo
      recentTickets.value = [
        {
          id: 1,
          title: "Login Issue with Safari Browser",
          status: "open",
          user: "John Doe",
          created_at: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          title: "Payment Gateway Error",
          status: "in_progress",
          user: "Jane Smith",
          created_at: "2024-01-15T09:15:00Z",
        },
        {
          id: 3,
          title: "Email Notification Not Working",
          status: "resolved",
          user: "Mike Johnson",
          created_at: "2024-01-14T16:45:00Z",
        },
      ];
    };

    const getStatusClass = (status) => {
      const classes = {
        open: "bg-yellow-100 text-yellow-800",
        in_progress: "bg-blue-100 text-blue-800",
        resolved: "bg-green-100 text-green-800",
        closed: "bg-gray-100 text-gray-800",
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    onMounted(() => {
      loadStats();
      loadRecentTickets();
    });

    return {
      stats,
      recentTickets,
      getStatusClass,
      formatDate,
    };
  },
};
</script>
