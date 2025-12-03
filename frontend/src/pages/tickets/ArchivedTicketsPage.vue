<template>
  <div>
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-3xl font-bold text-gray-900">Archived Tickets</h1>
        <p class="mt-2 text-sm text-gray-700">
          View and manage archived support tickets
        </p>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Priority
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created By
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created At
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="ticket in tickets"
              :key="ticket.id"
              class="hover:bg-gray-50 cursor-pointer"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                #{{ ticket.id }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ ticket.title }}
              </td>
              <td class="px-3 py-4 text-sm text-gray-500">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :style="{
                    backgroundColor: ticket.category?.color || '#gray',
                    color: '#fff',
                  }"
                >
                  {{ ticket.category }}
                </span>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  :class="getStatusClass(ticket.status)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ ticket.status }}
                </span>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  :class="getPriorityClass(ticket.priority)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ ticket.priority }}
                </span>
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
                    @click.stop="unarchiveTicket(ticket.id)"
                    type="button"
                    class="inline-flex items-center px-3 py-1.5 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Unarchive
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination.totalPages > 1"
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
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
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ticketService } from "@/services";

export default {
  name: "ArchivedTicketsPage",
  setup() {
    const router = useRouter();
    const tickets = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const pagination = ref({
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    });

    const visiblePages = computed(() => {
      const pages = [];
      const total = pagination.value.totalPages;
      const current = pagination.value.page;
      const maxVisible = 5;

      let start = Math.max(1, current - Math.floor(maxVisible / 2));
      let end = Math.min(total, start + maxVisible - 1);

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    });

    const loadTickets = async () => {
      try {
        const params = {
          page: currentPage.value,
          limit: itemsPerPage.value,
          archived: '1'
        };

        const response = await ticketService.getTickets(params);

        if (response.success) {
          tickets.value = response.tickets.map((ticket) => ({
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            status: ticket.status,
            priority: ticket.priority,
            category: ticket.category_name,
            user: ticket.created_by_name || 'Unknown',
            created_at: ticket.created_at,
          }));

          pagination.value = response.pagination;
        }
      } catch (error) {
        console.error("Failed to load archived tickets:", error);
      }
    };

    const changePage = (page) => {
      if (page >= 1 && page <= pagination.value.totalPages) {
        currentPage.value = page;
        loadTickets();
      }
    };

    const goToTicket = (ticketId) => {
      router.push(`/tickets/${ticketId}`);
    };

    const unarchiveTicket = async (ticketId) => {
      if (confirm(`Are you sure you want to unarchive ticket #${ticketId}?`)) {
        try {
          const response = await ticketService.updateTicket(ticketId, { archived: false });

          if (response.success) {
            alert("Ticket unarchived successfully!");
            loadTickets();
          } else {
            alert("Failed to unarchive ticket: " + response.message);
          }
        } catch (error) {
          console.error("Unarchive failed:", error);
          alert("Failed to unarchive ticket");
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
    });

    return {
      tickets,
      pagination,
      visiblePages,
      changePage,
      goToTicket,
      unarchiveTicket,
      getStatusClass,
      getPriorityClass,
      formatDate,
    };
  },
};
</script>
