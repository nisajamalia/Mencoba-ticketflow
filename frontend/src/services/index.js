import api from "./api";

export const authService = {
  async login(credentials) {
    const response = await api.post("/login", credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post("/register", userData);
    return response.data;
  },

  async logout() {
    const response = await api.post("/logout");
    return response.data;
  },

  async getUser() {
    const response = await api.get("/user");
    return response.data;
  },

  async updateProfile(userData) {
    const response = await api.put("/profile", userData);
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  },
};

export const ticketService = {
  async getTickets(params = {}) {
    const response = await api.get("/tickets", { params });
    return response.data;
  },

  async getTicket(id) {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  async createTicket(ticketData) {
    const response = await api.post("/tickets", ticketData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async updateTicket(id, ticketData) {
    const response = await api.put(`/tickets/${id}`, ticketData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async deleteTicket(id) {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  async getTicketStats() {
    const response = await api.get("/tickets-stats");
    return response.data;
  },

  async getActivityLogs(ticketId) {
    const response = await api.get(`/tickets/${ticketId}/activity-logs`);
    return response.data;
  },

  async assignTicket(ticketId, userId) {
    const response = await api.put(`/tickets/${ticketId}/assign`, {
      assigned_to: userId,
    });
    return response.data;
  },
};

export const categoryService = {
  async getCategories() {
    const response = await api.get("/categories");
    return response.data;
  },

  async createCategory(categoryData) {
    const response = await api.post("/categories", categoryData);
    return response.data;
  },

  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const commentService = {
  async getComments(ticketId) {
    const response = await api.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },

  async createComment(ticketId, commentData) {
    const response = await api.post(
      `/tickets/${ticketId}/comments`,
      commentData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async updateComment(commentId, commentData) {
    const response = await api.put(`/comments/${commentId}`, commentData);
    return response.data;
  },

  async deleteComment(commentId) {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};

export const adminService = {
  async getDashboard() {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  async getUsers(params = {}) {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  async updateUserRole(userId, role) {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  async getSystemStats() {
    const response = await api.get("/admin/system-stats");
    return response.data;
  },
};
