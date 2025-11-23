<template>
  <div>
    <div class="mb-6">
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <router-link
          to="/register"
          class="font-medium text-primary-600 hover:text-primary-500"
        >
          create a new account
        </router-link>
      </p>

      <!-- Demo Credentials Info -->
      <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h4 class="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h4>
        <div class="text-xs text-blue-700 space-y-1">
          <div><strong>Admin:</strong> admin@ticketing.com / password</div>
          <div><strong>User:</strong> user@ticketing.com / password</div>
        </div>
      </div>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- General Error Message -->
      <div
        v-if="generalError"
        class="bg-red-50 border border-red-200 rounded-md p-4"
      >
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Login Failed</h3>
            <div class="mt-1 text-sm text-red-700">
              {{ generalError }}
            </div>
          </div>
        </div>
      </div>

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
        <label for="password" class="label">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          v-model="form.password"
          class="input"
          :class="{ 'border-red-300': errors.password }"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">
          {{ errors.password[0] }}
        </p>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            v-model="form.remember"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="remember" class="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <router-link
            to="/forgot-password"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            Forgot your password?
          </router-link>
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="authStore.loading"
          class="btn-primary w-full"
        >
          <span v-if="authStore.loading" class="spinner mr-2"></span>
          {{ authStore.loading ? "Signing in..." : "Sign in" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

export default {
  name: "LoginPage",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const form = reactive({
      email: "",
      password: "",
      remember: false,
    });

    const errors = ref({});
    const generalError = ref("");

    const handleSubmit = async () => {
      errors.value = {};
      generalError.value = "";

      try {
        await authStore.login(form);
        router.push("/dashboard");
      } catch (error) {
        if (error.response?.data?.errors) {
          errors.value = error.response.data.errors;
        } else {
          generalError.value =
            error.message || "Invalid email or password. Please try again.";
        }
      }
    };

    return {
      authStore,
      form,
      errors,
      generalError,
      handleSubmit,
    };
  },
};
</script>
