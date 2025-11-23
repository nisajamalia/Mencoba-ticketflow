<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8" v-if="ticket">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                {{ ticket.title }}
              </h1>
              <div class="mt-2 flex items-center space-x-4">
                <span
                  :class="getStatusClass(ticket.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ ticket.status }}
                </span>
                <span
                  :class="getPriorityClass(ticket.priority)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ ticket.priority }}
                </span>
                <span class="text-sm text-gray-500">
                  Created {{ formatDate(ticket.created_at) }}
                </span>
              </div>
            </div>
            <div class="flex space-x-3">
              <button
                @click="$router.push(`/tickets/${ticket.id}/edit`)"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                @click="updateStatus"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <!-- Ticket Details -->
            <div class="bg-white shadow sm:rounded-lg mb-6">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Description
                </h3>
                <div class="prose max-w-none">
                  <p class="text-gray-700">{{ ticket.description }}</p>
                </div>
              </div>
            </div>

            <!-- Attachments -->
            <div
              v-if="ticket.attachments && ticket.attachments.length > 0"
              class="bg-white shadow sm:rounded-lg mb-6"
            >
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Attachments
                </h3>
                <ul class="divide-y divide-gray-200">
                  <li
                    v-for="attachment in ticket.attachments"
                    :key="attachment.id"
                    class="py-3 flex items-center justify-between"
                  >
                    <div class="flex items-center">
                      <svg
                        class="flex-shrink-0 h-5 w-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span class="ml-2 text-sm text-gray-900">{{
                        attachment.name
                      }}</span>
                    </div>
                    <button
                      class="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                    >
                      Download
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Comments -->
            <div class="bg-white shadow sm:rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Comments ({{ comments.length }})
                </h3>

                <!-- Comment List -->
                <div class="space-y-6 mb-6">
                  <div
                    v-for="comment in comments"
                    :key="comment.id"
                    class="flex space-x-3"
                  >
                    <div class="flex-shrink-0">
                      <div
                        class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                      >
                        <span class="text-sm font-medium text-gray-700">{{
                          comment.user.charAt(0)
                        }}</span>
                      </div>
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="text-sm">
                        <span class="font-medium text-gray-900">{{
                          comment.user
                        }}</span>
                        <span class="text-gray-500 ml-2">{{
                          formatDate(comment.created_at)
                        }}</span>
                      </div>
                      <div class="mt-1 text-sm text-gray-700">
                        <p>{{ comment.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Add Comment -->
                <form @submit.prevent="addComment" class="mt-6">
                  <div>
                    <label for="comment" class="sr-only">Comment</label>
                    <textarea
                      v-model="newComment"
                      id="comment"
                      rows="3"
                      class="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Add a comment..."
                    ></textarea>
                  </div>
                  <div class="mt-3 flex justify-end">
                    <button
                      type="submit"
                      :disabled="!newComment.trim()"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      Add Comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-white shadow sm:rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Ticket Information
                </h3>
                <dl class="space-y-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Ticket ID</dt>
                    <dd class="mt-1 text-sm text-gray-900">#{{ ticket.id }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Category</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {{ ticket.category }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Priority</dt>
                    <dd class="mt-1">
                      <span
                        :class="getPriorityClass(ticket.priority)"
                        class="px-2 py-1 text-xs font-medium rounded-full"
                      >
                        {{ ticket.priority }}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Status</dt>
                    <dd class="mt-1">
                      <span
                        :class="getStatusClass(ticket.status)"
                        class="px-2 py-1 text-xs font-medium rounded-full"
                      >
                        {{ ticket.status }}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">
                      Created by
                    </dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {{ ticket.user }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">
                      Last updated
                    </dt>
                    <dd class="mt-1 text-sm text-gray-900">
                      {{ formatDate(ticket.updated_at) }}
                    </dd>
                  </div>
                </dl>
              </div>
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
        <p class="mt-4 text-gray-600">Loading ticket details...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useTicketStore } from "@/stores/tickets";

export default {
  name: "TicketDetailPage",
  setup() {
    const route = useRoute();
    const ticketStore = useTicketStore();
    const ticket = ref(null);
    const comments = ref([]);
    const newComment = ref("");

    const loadTicket = async () => {
      try {
        const ticketId = route.params.id;
        const response = await ticketStore.fetchTicket(ticketId);
        ticket.value = response.data;
      } catch (error) {
        console.error("Error loading ticket:", error);
      }
    };

    const loadComments = async () => {
      // Mock data for demo
      comments.value = [
        {
          id: 1,
          user: "Support Agent",
          content:
            "Thank you for reporting this issue. We are investigating the Safari compatibility problem. Can you please tell us which version of Safari you are using?",
          created_at: "2024-01-15T11:15:00Z",
        },
        {
          id: 2,
          user: "John Doe",
          content:
            "I am using Safari Version 17.1.2 (18616.2.9.11.10) on macOS Sonoma 14.1.2",
          created_at: "2024-01-15T11:30:00Z",
        },
        {
          id: 3,
          user: "Support Agent",
          content:
            "Thank you for the version information. We have identified a potential issue with our authentication cookies in Safari 17+. Our development team is working on a fix.",
          created_at: "2024-01-15T14:22:00Z",
        },
      ];
    };

    const addComment = async () => {
      if (!newComment.value.trim()) return;

      // Mock comment addition
      const comment = {
        id: comments.value.length + 1,
        user: "Current User",
        content: newComment.value,
        created_at: new Date().toISOString(),
      };

      comments.value.push(comment);
      newComment.value = "";
    };

    const updateStatus = () => {
      // Mock status update
      const statuses = ["open", "in_progress", "resolved", "closed"];
      const currentIndex = statuses.indexOf(ticket.value.status);
      const nextIndex = (currentIndex + 1) % statuses.length;
      ticket.value.status = statuses[nextIndex];
    };

    const getStatusClass = (status) => {
      const classes = {
        open: "bg-yellow-100 text-yellow-800",
        in_progress: "bg-blue-100 text-blue-800",
        resolved: "bg-green-100 text-green-800",
        closed: "bg-gray-100 text-gray-800",
      };
      return classes[status] || "bg-gray-100 text-gray-800";
    };

    const getPriorityClass = (priority) => {
      const classes = {
        low: "bg-gray-100 text-gray-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-orange-100 text-orange-800",
        urgent: "bg-red-100 text-red-800",
      };
      return classes[priority] || "bg-gray-100 text-gray-800";
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString();
    };

    onMounted(() => {
      loadTicket();
      loadComments();
    });

    return {
      ticket,
      comments,
      newComment,
      addComment,
      updateStatus,
      getStatusClass,
      getPriorityClass,
      formatDate,
    };
  },
};
</script>
