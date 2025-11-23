<template>
  <div>
    <div class="mb-6">
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <router-link
          to="/login"
          class="font-medium text-primary-600 hover:text-primary-500"
        >
          sign in to your existing account
        </router-link>
      </p>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div>
        <label for="name" class="label">Full name</label>
        <input
          id="name"
          name="name"
          type="text"
          autocomplete="name"
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
          autocomplete="new-password"
          required
          v-model="form.password"
          class="input"
          :class="{ 'border-red-300': errors.password }"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">
          {{ errors.password[0] }}
        </p>
      </div>

      <div>
        <label for="password_confirmation" class="label"
          >Confirm password</label
        >
        <input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          autocomplete="new-password"
          required
          v-model="form.password_confirmation"
          class="input"
          :class="{ 'border-red-300': errors.password_confirmation }"
        />
        <p
          v-if="errors.password_confirmation"
          class="mt-1 text-sm text-red-600"
        >
          {{ errors.password_confirmation[0] }}
        </p>
      </div>

      <div>
        <button
          type="submit"
          :disabled="authStore.loading"
          class="btn-primary w-full"
        >
          <span v-if="authStore.loading" class="spinner mr-2"></span>
          {{ authStore.loading ? "Creating account..." : "Create account" }}
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
  name: "RegisterPage",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const form = reactive({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });

    const errors = ref({});

    const handleSubmit = async () => {
      errors.value = {};

      try {
        await authStore.register(form);
        router.push("/dashboard");
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
