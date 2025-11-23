<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
      <p class="mt-1 text-sm text-gray-600">
        Update your personal information and account settings.
      </p>
    </div>

    <!-- Profile Form -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="name" class="label">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              v-model="form.name"
              class="input"
              :class="{ 'border-red-300': errors.name }"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">
              {{ errors.name[0] }}
            </p>
          </div>

          <div>
            <label for="email" class="label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              v-model="form.email"
              class="input"
              :class="{ 'border-red-300': errors.email }"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email[0] }}
            </p>
          </div>

          <div class="flex justify-end space-x-3">
            <button type="button" @click="resetForm" class="btn-outline">
              Reset
            </button>
            <button
              type="submit"
              :disabled="authStore.loading"
              class="btn-primary"
            >
              <span v-if="authStore.loading" class="spinner mr-2"></span>
              {{ authStore.loading ? "Updating..." : "Update Profile" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Account Information -->
    <div class="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
          Account Information
        </h3>
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt class="text-sm font-medium text-gray-500">Role</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <span
                :class="authStore.isAdmin ? 'badge-danger' : 'badge-primary'"
              >
                {{
                  authStore.user?.role === "admin" ? "Administrator" : "User"
                }}
              </span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Member since</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatDate(authStore.user?.created_at) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Email verified</dt>
            <dd class="mt-1 text-sm text-gray-900">
              <span
                :class="
                  authStore.user?.email_verified_at
                    ? 'badge-success'
                    : 'badge-warning'
                "
              >
                {{
                  authStore.user?.email_verified_at
                    ? "Verified"
                    : "Not verified"
                }}
              </span>
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Last updated</dt>
            <dd class="mt-1 text-sm text-gray-900">
              {{ formatDate(authStore.user?.updated_at) }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "ProfilePage",
  setup() {
    const authStore = useAuthStore();
    const errors = ref({});

    const form = reactive({
      name: "",
      email: "",
    });

    const initializeForm = () => {
      if (authStore.user) {
        form.name = authStore.user.name;
        form.email = authStore.user.email;
      }
    };

    const resetForm = () => {
      initializeForm();
      errors.value = {};
    };

    const handleSubmit = async () => {
      errors.value = {};

      try {
        await authStore.updateProfile(form);
      } catch (error) {
        if (error.response?.data?.errors) {
          errors.value = error.response.data.errors;
        }
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    onMounted(() => {
      initializeForm();
    });

    return {
      authStore,
      form,
      errors,
      handleSubmit,
      resetForm,
      formatDate,
    };
  },
};
</script>
