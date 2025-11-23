<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
            <p class="mt-2 text-sm text-gray-700">
              Manage system users and their permissions
            </p>
          </div>
          <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add User
            </button>
          </div>
        </div>

        <!-- Users Table -->
        <div class="mt-8 flex flex-col">
          <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
            >
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
                        Name
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Role
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
                        Created
                      </th>
                      <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span class="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-for="user in users" :key="user.id">
                      <td
                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6"
                      >
                        <div class="flex items-center">
                          <div class="h-10 w-10 flex-shrink-0">
                            <div
                              class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                            >
                              <span class="text-sm font-medium text-gray-700">{{
                                user.name.charAt(0)
                              }}</span>
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="font-medium text-gray-900">
                              {{ user.name }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      >
                        {{ user.email }}
                      </td>
                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      >
                        <span
                          :class="getRoleClass(user.role)"
                          class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                        >
                          {{ user.role }}
                        </span>
                      </td>
                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      >
                        <span
                          :class="getStatusClass(user.status)"
                          class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                        >
                          {{ user.status }}
                        </span>
                      </td>
                      <td
                        class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                      >
                        {{ formatDate(user.created_at) }}
                      </td>
                      <td
                        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                      >
                        <button
                          @click="editUser(user)"
                          class="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          @click="deleteUser(user)"
                          class="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Create User Modal -->
        <div
          v-if="showCreateModal"
          class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        >
          <div
            class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
          >
            <div class="mt-3">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Create New User
              </h3>
              <form @submit.prevent="createUser">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Name</label
                  >
                  <input
                    v-model="newUser.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Email</label
                  >
                  <input
                    v-model="newUser.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Password</label
                  >
                  <input
                    v-model="newUser.password"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Role</label
                  >
                  <select
                    v-model="newUser.role"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div class="flex justify-end space-x-3">
                  <button
                    @click="showCreateModal = false"
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Create User
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
  name: "AdminUsersPage",
  components: {
    Navbar,
  },
  setup() {
    const users = ref([]);
    const showCreateModal = ref(false);
    const newUser = ref({
      name: "",
      email: "",
      password: "",
      role: "user",
    });

    const loadUsers = async () => {
      // Mock data for demo
      users.value = [
        {
          id: 1,
          name: "Admin User",
          email: "admin@ticketing.com",
          role: "admin",
          status: "active",
          created_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          status: "active",
          created_at: "2024-01-10T00:00:00Z",
        },
        {
          id: 3,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "user",
          status: "active",
          created_at: "2024-01-12T00:00:00Z",
        },
      ];
    };

    const createUser = async () => {
      // Mock creation - in real app, this would call API
      const user = {
        id: users.value.length + 1,
        ...newUser.value,
        status: "active",
        created_at: new Date().toISOString(),
      };
      users.value.push(user);

      // Reset form
      newUser.value = {
        name: "",
        email: "",
        password: "",
        role: "user",
      };
      showCreateModal.value = false;
    };

    const editUser = (user) => {
      // In real app, this would open edit modal
      console.log("Edit user:", user);
    };

    const deleteUser = (user) => {
      if (confirm("Are you sure you want to delete this user?")) {
        const index = users.value.findIndex((u) => u.id === user.id);
        if (index > -1) {
          users.value.splice(index, 1);
        }
      }
    };

    const getRoleClass = (role) => {
      return role === "admin"
        ? "bg-purple-100 text-purple-800"
        : "bg-gray-100 text-gray-800";
    };

    const getStatusClass = (status) => {
      return status === "active"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    onMounted(() => {
      loadUsers();
    });

    return {
      users,
      showCreateModal,
      newUser,
      createUser,
      editUser,
      deleteUser,
      getRoleClass,
      getStatusClass,
      formatDate,
    };
  },
};
</script>
