<template>
  <div>
    <div class="mb-6">
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Forgot your password?
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label for="email" class="label">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          v-model="form.email"
          class="input"
          :class="{ 'border-red-300': errors.email }"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">
          {{ errors.email[0] }}
        </p>
      </div>

      <div>
        <button
          type="submit"
          :disabled="authStore.loading"
          class="btn-primary w-full"
        >
          <span v-if="authStore.loading" class="spinner mr-2"></span>
          {{ authStore.loading ? "Sending..." : "Send reset link" }}
        </button>
      </div>

      <div class="text-center">
        <router-link
          to="/login"
          class="font-medium text-primary-600 hover:text-primary-500"
        >
          Back to sign in
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "ForgotPasswordPage",
  setup() {
    const authStore = useAuthStore();

    const form = reactive({
      email: "",
    });

    const errors = ref({});

    const handleSubmit = async () => {
      errors.value = {};

      try {
        await authStore.forgotPassword(form.email);
        // Reset form after successful submission
        form.email = "";
      } catch (error) {
        if (error.response?.data?.errors) {
          errors.value = error.response.data.errors;
        }
      }
    };

    return {
      authStore,
      form,
      errors,
      handleSubmit,
    };
  },
};
</script>
