<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation breadcrumb -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-4xl mx-auto py-4 sm:px-6 lg:px-8">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <router-link
                to="/dashboard"
                class="text-gray-400 hover:text-gray-500"
              >
                Dashboard
              </router-link>
            </li>
            <li>
              <svg
                class="h-5 w-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </li>
            <li>
              <router-link
                to="/tickets"
                class="text-gray-400 hover:text-gray-500"
              >
                Tickets
              </router-link>
            </li>
            <li>
              <svg
                class="h-5 w-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </li>
            <li class="text-gray-700">Create New Ticket</li>
          </ol>
        </nav>
      </div>
    </div>

    <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Create New Ticket</h1>
          <p class="mt-2 text-sm text-gray-600">
            Submit a new support ticket for assistance
          </p>
        </div>

        <div class="bg-white shadow sm:rounded-lg">
          <form @submit.prevent="createTicket" class="space-y-6 p-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700"
                >Title</label
              >
              <input
                v-model="form.title"
                type="text"
                id="title"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label
                for="category"
                class="block text-sm font-medium text-gray-700"
                >Category</label
              >
              <select
                v-model="form.category_id"
                id="category"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="priority"
                class="block text-sm font-medium text-gray-700"
                >Priority</label
              >
              <select
                v-model="form.priority"
                id="priority"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label
                for="description"
                class="block text-sm font-medium text-gray-700"
                >Description</label
              >
              <textarea
                v-model="form.description"
                id="description"
                rows="6"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Provide detailed information about your issue..."
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                @click="$router.push('/tickets')"
                type="button"
                class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <span v-if="loading">Creating...</span>
                <span v-else>Create Ticket</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTicketStore } from "@/stores/tickets";

export default {
  name: "TicketCreatePage",
  setup() {
    const router = useRouter();
    const ticketStore = useTicketStore();
    const loading = ref(false);
    const categories = ref([]);

    const form = ref({
      title: "",
      category_id: "",
      priority: "",
      description: "",
    });

    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        categories.value = data;
      } catch (error) {
        console.error('Failed to load categories:', error);
        // Fallback to mock data
        categories.value = [
          { id: 1, name: "Technical Support" },
          { id: 2, name: "Billing" },
          { id: 3, name: "General Inquiry" },
          { id: 4, name: "Bug Report" },
          { id: 5, name: "Feature Request" },
        ];
      }
    };

    const createTicket = async () => {
      console.log("=== CREATE TICKET FUNCTION CALLED ===");
      console.log("Form data:", form.value);

      // Validate form data
      if (!form.value.title || !form.value.description) {
        alert("Please fill in all required fields.");
        return;
      }

      loading.value = true;

      try {
        // Prepare the ticket data with proper category_id conversion
        const ticketData = {
          ...form.value,
          category_id: parseInt(form.value.category_id),
        };

        console.log("Prepared ticket data:", ticketData);
        console.log("Calling ticketStore.createTicket...");

        await ticketStore.createTicket(ticketData);

        console.log("Ticket created successfully, navigating to tickets page");
        router.push("/tickets");
      } catch (error) {
        console.error("Error creating ticket:", error);
        alert("Failed to create ticket. Please try again.");
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadCategories();
    });

    return {
      form,
      categories,
      loading,
      createTicket,
    };
  },
};
</script>
