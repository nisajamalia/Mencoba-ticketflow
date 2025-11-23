import { defineStore } from "pinia";
import { authService } from "@/services";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        // Mock authentication for demo
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

        // Demo credentials
        const validCredentials = {
          "admin@ticketing.com": {
            password: "password",
            role: "admin",
            name: "System Administrator",
          },
          "user@ticketing.com": {
            password: "password",
            role: "user",
            name: "Regular User",
          },
          "john@example.com": {
            password: "password",
            role: "user",
            name: "John Doe",
          },
        };

        const user = validCredentials[credentials.email];
        if (!user || user.password !== credentials.password) {
          throw new Error("Invalid credentials");
        }

        const mockResponse = {
          user: {
            id: 1,
            name: user.name,
            email: credentials.email,
            role: user.role,
          },
          token: "demo-token-" + Date.now(),
        };

        this.user = mockResponse.user;
        this.token = mockResponse.token;
        localStorage.setItem("token", mockResponse.token);
        localStorage.setItem("user", JSON.stringify(mockResponse.user));

        toast.success("Login successful!");
        return mockResponse;
      } catch (error) {
        this.error = error.message || "Login failed";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        // Mock registration for demo
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockResponse = {
          user: {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            role: "user",
          },
          token: "demo-token-" + Date.now(),
        };

        this.user = mockResponse.user;
        this.token = mockResponse.token;
        localStorage.setItem("token", mockResponse.token);
        localStorage.setItem("user", JSON.stringify(mockResponse.user));

        toast.success("Registration successful!");
        return mockResponse;
      } catch (error) {
        this.error = error.message || "Registration failed";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        // For demo, just clear local storage
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
      }
    },

    async fetchUser() {
      if (!this.token) return;

      this.loading = true;
      try {
        // For demo, get user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          this.user = JSON.parse(storedUser);
        } else {
          // Fallback to default admin user
          this.user = {
            id: 1,
            name: "System Administrator",
            email: "admin@ticketing.com",
            role: "admin",
          };
        }
      } catch (error) {
        console.error("Fetch user error:", error);
        this.logout();
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(userData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.updateProfile(userData);
        this.user = response.user;
        toast.success("Profile updated successfully!");
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Update failed";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(email) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.forgotPassword(email);
        toast.success("Password reset link sent to your email");
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Request failed";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    initializeAuth() {
      if (this.token) {
        this.fetchUser();
      }
    },
  },
});
