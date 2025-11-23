<template>
  <div class="min-h-screen bg-gray-50">
    <div
      class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8"
      v-if="ticket"
      :key="`ticket-edit-${$route.params.id}`"
    >
      <div class="px-4 py-6 sm:px-0">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Edit Ticket</h1>
          <p class="mt-2 text-sm text-gray-600">Update ticket information</p>
        </div>

        <div class="bg-white shadow sm:rounded-lg">
          <div class="space-y-6 p-6">
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
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div>
              <label
                for="status"
                class="block text-sm font-medium text-gray-700"
                >Status</label
              >
              <select
                v-model="form.status"
                id="status"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
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
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                @click="$router.push(`/tickets/${ticket.id}`)"
                type="button"
                class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                @click="updateTicket"
                type="button"
                :disabled="loading"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <span v-if="loading">Updating...</span>
                <span v-else>Update Ticket</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-else
      class="min-h-screen bg-gray-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"
        ></div>
        <p class="mt-4 text-gray-600">Loading ticket...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTicketStore } from "@/stores/tickets.js";

export default {
  name: "TicketEditPage",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const ticketStore = useTicketStore();
    const loading = ref(false);
    const ticket = ref(null);
    const categories = ref([]);

    const form = ref({
      title: "",
      category_id: "",
      priority: "",
      status: "",
      description: "",
    });

    const loadTicket = async () => {
      try {
        const ticketId = route.params.id;
        console.log("Loading ticket with ID:", ticketId);

        // Reset form state first
        form.value = {
          title: "",
          category_id: "",
          priority: "",
          status: "",
          description: "",
        };

        const response = await ticketStore.fetchTicket(ticketId);
        ticket.value = response.data;
        console.log("Loaded ticket data:", ticket.value);

        // Populate form with ticket data
        // Find category_id by matching category name if category_id is not available
        let categoryId = ticket.value.category_id;
        if (!categoryId && ticket.value.category) {
          const matchedCategory = categories.value.find(
            (cat) => cat.name === ticket.value.category
          );
          categoryId = matchedCategory ? matchedCategory.id : "";
        }

        form.value = {
          title: ticket.value.title || "",
          category_id: categoryId || "",
          priority: ticket.value.priority || "",
          status: ticket.value.status || "",
          description: ticket.value.description || "",
        };
      } catch (error) {
        console.error("Error loading ticket:", error);
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

    const updateTicket = async () => {
      console.log("=== UPDATE BUTTON CLICKED ===");
      console.log("Event triggered at:", new Date().toISOString());
      console.log("Loading state:", loading.value);

      // Prevent multiple rapid clicks
      if (loading.value) {
        console.log("Update already in progress, ignoring click");
        return;
      }

      console.log("Update ticket button clicked");
      console.log("Form data:", form.value);
      console.log("Current ticket:", ticket.value);

      // Validate form data
      if (!form.value.title?.trim() || !form.value.description?.trim()) {
        alert("Please fill in all required fields.");
        return;
      }

      // Check if status has changed and ask for confirmation
      if (form.value.status !== ticket.value.status) {
        const confirmed = confirm(
          `Are you sure you want to change the ticket status from "${ticket.value.status}" to "${form.value.status}"?`
        );
        if (!confirmed) {
          console.log("Status change cancelled by user");
          return;
        }
      }

      loading.value = true;

      try {
        // Prepare the update data with category name lookup
        const selectedCategory = categories.value.find(
          (cat) => cat.id == form.value.category_id
        );
        const updateData = {
          ...form.value,
          category: selectedCategory
            ? selectedCategory.name
            : ticket.value.category,
          category_id: parseInt(form.value.category_id),
        };

        console.log("Calling ticketStore.updateTicket with:", updateData);
        const result = await ticketStore.updateTicket(
          ticket.value.id,
          updateData
        );
        console.log("Update successful, result:", result);

        // Update the local ticket data to reflect changes
        ticket.value = { ...ticket.value, ...updateData };

        // Wait for next tick to ensure all reactivity updates complete
        await nextTick();

        console.log("Update operation completed successfully");
        console.log("Navigating to dashboard");

        // Navigate to dashboard after successful update
        router.push("/dashboard");
        console.log("=== UPDATE OPERATION COMPLETE ===");
      } catch (error) {
        console.error("Error updating ticket:", error);
        alert("Failed to update ticket. Please try again.");
      } finally {
        loading.value = false;
        console.log("Loading state reset to false");
      }
    };

    // Watch for route parameter changes to handle navigation to different tickets
    watch(
      () => route.params.id,
      async (newId, oldId) => {
        if (newId && newId !== oldId) {
          console.log("Route parameter changed, reloading ticket:", newId);
          // Reset loading state
          loading.value = false;

          // Reload ticket data
          await loadTicket();
        }
      },
      { immediate: false }
    );

    onMounted(async () => {
      console.log("TicketEditPage mounted for ticket ID:", route.params.id);
      // Load categories first, then ticket so category mapping works properly
      await loadCategories();
      await loadTicket();
    });

    return {
      ticket,
      form,
      categories,
      loading,
      updateTicket,
    };
  },
};
</script>
