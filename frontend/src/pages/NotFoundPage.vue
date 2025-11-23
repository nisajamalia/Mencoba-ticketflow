<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-9xl font-bold text-gray-300">404</h1>
        <h2 class="mt-4 text-3xl font-bold text-gray-900">Page not found</h2>
        <p class="mt-2 text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
      </div>

      <div class="text-center">
        <router-link to="/dashboard" class="btn-primary">
          Go back to dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFoundPage",
};
</script>
