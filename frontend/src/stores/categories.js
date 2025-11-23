import { defineStore } from "pinia";
import { categoryService } from "@/services";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useCategoryStore = defineStore("categories", {
  state: () => ({
    categories: [],
    loading: false,
    error: null,
  }),

  getters: {
    categoryById: (state) => (id) => {
      return state.categories.find((category) => category.id === parseInt(id));
    },

    activeCategories: (state) => {
      return state.categories.filter((category) => category.is_active);
    },
  },

  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;

      try {
        const response = await categoryService.getCategories();
        this.categories = response.data;
        return response;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to fetch categories";
        console.error("Fetch categories error:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(categoryData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await categoryService.createCategory(categoryData);
        this.categories.push(response.data);
        toast.success("Category created successfully!");
        return response;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to create category";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateCategory(id, categoryData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await categoryService.updateCategory(id, categoryData);

        const index = this.categories.findIndex((c) => c.id === parseInt(id));
        if (index !== -1) {
          this.categories[index] = response.data;
        }

        toast.success("Category updated successfully!");
        return response;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to update category";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(id) {
      this.loading = true;
      this.error = null;

      try {
        await categoryService.deleteCategory(id);
        this.categories = this.categories.filter((c) => c.id !== parseInt(id));
        toast.success("Category deleted successfully!");
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to delete category";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
