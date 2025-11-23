<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <h1 class="text-3xl font-bold text-primary-600">Ticketing System</h1>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <router-view />
      </div>
    </div>

    <div class="mt-8 text-center">
      <p class="text-sm text-gray-600">
        &copy; 2024 Ticketing System. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthLayout",
};
</script>
