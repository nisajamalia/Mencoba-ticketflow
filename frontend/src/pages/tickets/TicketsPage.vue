<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-3xl font-bold text-gray-900">Support Tickets</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage and track all support tickets
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <router-link
          to="/tickets/create"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          Create Ticket
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="mt-8 bg-white p-6 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label
            for="search"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Search</label
          >
          <input
            v-model="filters.search"
            type="text"
            id="search"
            placeholder="Search tickets..."
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            for="status"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Status</label
          >
          <select
            v-model="filters.status"
            id="status"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div>
          <label
            for="priority"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Priority</label
          >
          <select
            v-model="filters.priority"
            id="priority"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div>
          <label
            for="category"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Category</label
          >
          <select
            v-model="filters.category"
            id="category"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.name"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label
            for="sortBy"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Sort By</label
          >
          <select
            v-model="sortBy"
            id="sortBy"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div
            class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Priority
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Created By
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Created
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="ticket in filteredTickets"
                  :key="`ticket-${ticket.id}-${ticket.updated_at}`"
                  class="hover:bg-gray-50"
                >
                  <td
                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 cursor-pointer"
                    @click="goToTicket(ticket.id)"
                  >
                    #{{ ticket.id }}
                  </td>
                  <td
                    class="px-3 py-4 text-sm text-gray-900 cursor-pointer"
                    @click="goToTicket(ticket.id)"
                  >
                    <div class="font-medium">{{ ticket.title }}</div>
                    <div class="text-gray-500 truncate max-w-xs">
                      {{ ticket.description }}
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      :class="getStatusClass(ticket.status)"
                      class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                    >
                      {{ ticket.status }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span
                      :class="getPriorityClass(ticket.priority)"
                      class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                    >
                      {{ ticket.priority }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ ticket.category }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ ticket.user }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ formatDate(ticket.created_at) }}
                  </td>
                  <td
                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                  >
                    <div class="flex justify-end space-x-2">
                      <button
                        @click.stop="goToTicket(ticket.id)"
                        type="button"
                        class="inline-flex items-center px-3 py-1.5 border border-indigo-300 rounded-md text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View
                      </button>
                      <button
                        @click.stop="editTicket(ticket.id)"
                        type="button"
                        class="inline-flex items-center px-3 py-1.5 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Edit
                      </button>
                      <button
                        @click.stop="archiveTicket(ticket.id)"
                        type="button"
                        class="inline-flex items-center px-3 py-1.5 border border-amber-300 rounded-md text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                      >
                        Archive
                      </button>
                      <button
                        @click.stop="deleteTicket(ticket)"
                        type="button"
                        class="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredTickets.length === 0" class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{
          tickets.length === 0
            ? "Get started by creating a new ticket."
            : "Try adjusting your search filters."
        }}
      </p>
      <div class="mt-6" v-if="tickets.length === 0">
        <router-link
          to="/tickets/create"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create your first ticket
        </router-link>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination.total > 0"
      class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-8 rounded-lg shadow"
    >
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page === pagination.totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{
              (pagination.page - 1) * pagination.limit + 1
            }}</span>
            to
            <span class="font-medium">{{
              Math.min(pagination.page * pagination.limit, pagination.total)
            }}</span>
            of
            <span class="font-medium">{{ pagination.total }}</span>
            results
          </p>
        </div>
        <div>
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Previous</span>
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                page === pagination.page
                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page === pagination.totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Next</span>
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useTicketStore } from "@/stores/tickets";

export default {
  name: "TicketsPage",
  setup() {
    const router = useRouter();
    const ticketStore = useTicketStore();
    const categories = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const sortBy = ref("newest");

    // Use tickets from store
    const tickets = computed(() => ticketStore.tickets);
    const pagination = ref({
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    const filters = ref({
      search: "",
      status: "",
      priority: "",
      category: "",
    });

    const loadTickets = async () => {
      try {
        const params = {
          page: currentPage.value,
          limit: itemsPerPage.value,
          sort: sortBy.value,
        };

        if (filters.value.search) {
          params.search = filters.value.search;
        }
        if (filters.value.status) {
          params.status = filters.value.status;
        }
        if (filters.value.priority) {
          params.priority = filters.value.priority;
        }
        if (filters.value.category) {
          params.category = filters.value.category;
        }

        await ticketStore.fetchTickets(params);
        pagination.value = ticketStore.pagination;
      } catch (error) {
        console.error("Error loading tickets:", error);
      }
    };

    const loadCategories = async () => {
      // Mock data for demo
      categories.value = [
        { id: 1, name: "Technical Support" },
        { id: 2, name: "Billing" },
        { id: 3, name: "General Inquiry" },
        { id: 4, name: "Bug Report" },
        { id: 5, name: "Feature Request" },
      ];
    };

    const filteredTickets = computed(() => {
      // Don't filter on frontend - filters are applied on backend
      return tickets.value;
    });

    const visiblePages = computed(() => {
      const pages = [];
      const maxVisible = 5;
      const half = Math.floor(maxVisible / 2);

      let start = Math.max(1, pagination.value.page - half);
      let end = Math.min(pagination.value.totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    });

    const changePage = async (page) => {
      if (page < 1 || page > pagination.value.totalPages) return;
      currentPage.value = page;
      await loadTickets();
    };

    const goToTicket = (ticketId) => {
      console.log("Navigating to ticket:", ticketId);
      router.push(`/tickets/${ticketId}`);
    };

    const editTicket = (ticketId) => {
      console.log("Navigating to edit ticket:", ticketId);
      router.push(`/tickets/${ticketId}/edit`);
    };

    const deleteTicket = (ticket) => {
      console.log("Working delete function called!");
      alert(`Working delete called for ticket #${ticket.id}`);

      if (confirm(`Are you sure you want to delete ticket #${ticket.id}?`)) {
        // Call store delete
        ticketStore
          .deleteTicket(ticket.id)
          .then(() => {
            alert("Delete successful!");
            loadTickets();
          })
          .catch((error) => {
            console.error("Delete failed:", error);
            alert("Delete failed!");
          });
      }
    };

    const archiveTicket = async (ticketId) => {
      if (confirm(`Are you sure you want to archive ticket #${ticketId}?`)) {
        try {
          await ticketStore.updateTicket(ticketId, { archived: true });
          // Remove from current list immediately
          ticketStore.tickets = ticketStore.tickets.filter(t => t.id !== ticketId);
          alert("Ticket archived successfully!");
          await loadTickets();
        } catch (error) {
          console.error("Archive failed:", error);
          alert("Failed to archive ticket");
        }
      }
    };

    const getStatusClass = (status) => {
      const classes = {
        open: "bg-yellow-100 text-yellow-800",
        in_progress: "bg-blue-100 text-blue-800",
        "in-progress": "bg-blue-100 text-blue-800",
        resolved: "bg-green-100 text-green-800",
        closed: "bg-gray-100 text-gray-800",
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };

    const getPriorityClass = (priority) => {
      const classes = {
        low: "bg-gray-100 text-gray-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-orange-100 text-orange-800",
        urgent: "bg-red-100 text-red-800",
      };
      return classes[priority] || "bg-gray-100 text-gray-800";
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    onMounted(() => {
      loadTickets();
      loadCategories();
    });

    // Watch for filter changes and reload tickets
    watch(
      [
        () => filters.value.search,
        () => filters.value.status,
        () => filters.value.priority,
        () => filters.value.category,
      ],
      () => {
        currentPage.value = 1; // Reset to first page when filters change
        loadTickets();
      }
    );

    // Watch for sort changes and reload tickets
    watch(sortBy, () => {
      currentPage.value = 1; // Reset to first page when sort changes
      loadTickets();
    });

    return {
      tickets,
      categories,
      filters,
      filteredTickets,
      pagination,
      visiblePages,
      sortBy,
      changePage,
      goToTicket,
      editTicket,
      deleteTicket,
      archiveTicket,
      getStatusClass,
      getPriorityClass,
      formatDate,
    };
  },
};
</script>
