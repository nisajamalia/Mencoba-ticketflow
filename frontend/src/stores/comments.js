import { defineStore } from "pinia";
import { commentService } from "@/services";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useCommentStore = defineStore("comments", {
  state: () => ({
    comments: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchComments(ticketId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await commentService.getComments(ticketId);
        this.comments = response.data;
        return response;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to fetch comments";
        console.error("Fetch comments error:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createComment(ticketId, commentData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await commentService.createComment(
          ticketId,
          commentData
        );
        this.comments.push(response.data);
        toast.success("Comment added successfully!");
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to add comment";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateComment(commentId, commentData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await commentService.updateComment(
          commentId,
          commentData
        );

        const index = this.comments.findIndex(
          (c) => c.id === parseInt(commentId)
        );
        if (index !== -1) {
          this.comments[index] = response.data;
        }

        toast.success("Comment updated successfully!");
        return response;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to update comment";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteComment(commentId) {
      this.loading = true;
      this.error = null;

      try {
        await commentService.deleteComment(commentId);
        this.comments = this.comments.filter(
          (c) => c.id !== parseInt(commentId)
        );
        toast.success("Comment deleted successfully!");
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to delete comment";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearComments() {
      this.comments = [];
    },
  },
});
