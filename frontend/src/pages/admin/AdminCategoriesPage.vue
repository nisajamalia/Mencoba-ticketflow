<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-3xl font-bold text-gray-900">
              Category Management
            </h1>
            <p class="mt-2 text-sm text-gray-700">
              Manage ticket categories and their settings
            </p>
          </div>
          <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Category
            </button>
          </div>
        </div>

        <!-- Categories Grid -->
        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="category in categories"
            :key="category.id"
            class="bg-white overflow-hidden shadow rounded-lg"
          >
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div
                    :class="`w-8 h-8 ${category.color} rounded-md flex items-center justify-center`"
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
                        d="M7 7h.01M7 3h5c1.08 0 2.06.42 2.78 1.09 0 0 0 0 0 0L21 10.5c.39.39.39 1.02 0 1.41L14.41 18.5C13.79 19.12 12.96 19.5 12 19.5s-1.79-.38-2.41-1L3.09 12c-.67-.67-1.09-1.6-1.09-2.56V4a1 1 0 011-1z"
                      />
                    </svg>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      {{ category.name }}
                    </dt>
                    <dd class="text-sm text-gray-900">
                      {{ category.description }}
                    </dd>
                  </dl>
                </div>
              </div>
              <div class="mt-5">
                <div class="flex justify-between text-sm text-gray-500">
                  <span>{{ category.ticketCount }} tickets</span>
                  <span>{{ category.active ? "Active" : "Inactive" }}</span>
                </div>
                <div class="mt-3 flex justify-end space-x-2">
                  <button
                    @click="editCategory(category)"
                    class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteCategory(category)"
                    class="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="categories.length === 0" class="text-center py-12">
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
              d="M7 7h.01M7 3h5c1.08 0 2.06.42 2.78 1.09L21 10.5c.39.39.39 1.02 0 1.41L14.41 18.5C13.79 19.12 12.96 19.5 12 19.5s-1.79-.38-2.41-1L3.09 12C2.42 11.33 2 10.4 2 9.44V4a1 1 0 011-1z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No categories</h3>
          <p class="mt-1 text-sm text-gray-500">
            Get started by creating a new category.
          </p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Category
            </button>
          </div>
        </div>

        <!-- Create/Edit Category Modal -->
        <div
          v-if="showCreateModal || editingCategory"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        >
          <div
            class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
          >
            <div class="mt-3">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                {{ editingCategory ? "Edit Category" : "Create New Category" }}
              </h3>
              <form @submit.prevent="saveCategory">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Name</label
                  >
                  <input
                    v-model="categoryForm.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Description</label
                  >
                  <textarea
                    v-model="categoryForm.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Color</label
                  >
                  <select
                    v-model="categoryForm.color"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="bg-blue-500">Blue</option>
                    <option value="bg-green-500">Green</option>
                    <option value="bg-yellow-500">Yellow</option>
                    <option value="bg-red-500">Red</option>
                    <option value="bg-purple-500">Purple</option>
                    <option value="bg-pink-500">Pink</option>
                    <option value="bg-indigo-500">Indigo</option>
                    <option value="bg-gray-500">Gray</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label class="flex items-center">
                    <input
                      v-model="categoryForm.active"
                      type="checkbox"
                      class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
                <div class="flex justify-end space-x-3">
                  <button
                    @click="cancelEdit"
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    {{ editingCategory ? "Update" : "Create" }} Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "AdminCategoriesPage",
  components: {
    Navbar,
  },
  setup() {
    const categories = ref([]);
    const showCreateModal = ref(false);
    const editingCategory = ref(null);

    const categoryForm = ref({
      name: "",
      description: "",
      color: "bg-blue-500",
      active: true,
    });

    const loadCategories = async () => {
      // Mock data for demo
      categories.value = [
        {
          id: 1,
          name: "Technical Support",
          description: "Issues related to technical problems and bugs",
          color: "bg-blue-500",
          active: true,
          ticketCount: 45,
        },
        {
          id: 2,
          name: "Billing",
          description: "Payment and billing related inquiries",
          color: "bg-green-500",
          active: true,
          ticketCount: 23,
        },
        {
          id: 3,
          name: "General Inquiry",
          description: "General questions and information requests",
          color: "bg-yellow-500",
          active: true,
          ticketCount: 67,
        },
        {
          id: 4,
          name: "Bug Report",
          description: "Software bugs and error reports",
          color: "bg-red-500",
          active: true,
          ticketCount: 12,
        },
        {
          id: 5,
          name: "Feature Request",
          description: "Requests for new features and improvements",
          color: "bg-purple-500",
          active: true,
          ticketCount: 9,
        },
      ];
    };

    const saveCategory = async () => {
      if (editingCategory.value) {
        // Update existing category
        const index = categories.value.findIndex(
          (c) => c.id === editingCategory.value.id
        );
        if (index > -1) {
          categories.value[index] = {
            ...editingCategory.value,
            ...categoryForm.value,
          };
        }
        editingCategory.value = null;
      } else {
        // Create new category
        const newCategory = {
          id: categories.value.length + 1,
          ...categoryForm.value,
          ticketCount: 0,
        };
        categories.value.push(newCategory);
        showCreateModal.value = false;
      }

      // Reset form
      categoryForm.value = {
        name: "",
        description: "",
        color: "bg-blue-500",
        active: true,
      };
    };

    const editCategory = (category) => {
      editingCategory.value = category;
      categoryForm.value = {
        name: category.name,
        description: category.description,
        color: category.color,
        active: category.active,
      };
    };

    const cancelEdit = () => {
      showCreateModal.value = false;
      editingCategory.value = null;
      categoryForm.value = {
        name: "",
        description: "",
        color: "bg-blue-500",
        active: true,
      };
    };

    const deleteCategory = (category) => {
      if (category.ticketCount > 0) {
        alert(
          "Cannot delete category with existing tickets. Please reassign tickets first."
        );
        return;
      }

      if (
        confirm(
          `Are you sure you want to delete the category "${category.name}"?`
        )
      ) {
        const index = categories.value.findIndex((c) => c.id === category.id);
        if (index > -1) {
          categories.value.splice(index, 1);
        }
      }
    };

    onMounted(() => {
      loadCategories();
    });

    return {
      categories,
      showCreateModal,
      editingCategory,
      categoryForm,
      saveCategory,
      editCategory,
      cancelEdit,
      deleteCategory,
    };
  },
};
</script>
