import { defineStore } from "pinia";
import { ticketService } from "@/services";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useTicketStore = defineStore("tickets", {
  state: () => ({
    tickets: JSON.parse(localStorage.getItem("tickets") || "[]"),
    currentTicket: null,
    stats: null,
    activityLogs: [],
    loading: false,
    error: null,
    initialized: localStorage.getItem("tickets") !== null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: JSON.parse(localStorage.getItem("tickets") || "[]").length,
    },
  }),

  getters: {
    ticketById: (state) => (id) => {
      return state.tickets.find((ticket) => ticket.id === parseInt(id));
    },
  },

  actions: {
    // Save tickets to localStorage
    saveTicketsToStorage() {
      try {
        console.log("Attempting to save tickets to localStorage...");
        localStorage.setItem("tickets", JSON.stringify(this.tickets));
        localStorage.setItem("ticketsInitialized", "true");
        console.log(
          "Successfully saved tickets to localStorage:",
          this.tickets.length,
          "tickets"
        );

        // Verify the save worked
        const saved = JSON.parse(localStorage.getItem("tickets") || "[]");
        console.log(
          "Verification - localStorage now contains:",
          saved.length,
          "tickets"
        );
      } catch (error) {
        console.warn("Failed to save tickets to localStorage:", error);
      }
    },

    // Clear all data (for testing/reset)
    clearAllData() {
      try {
        localStorage.removeItem("tickets");
        localStorage.removeItem("ticketsInitialized");
        this.tickets = [];
        this.initialized = false;
        this.pagination.total = 0;
        console.log("Cleared all ticket data");
      } catch (error) {
        console.warn("Failed to clear localStorage:", error);
      }
    },

    async fetchTickets(params = {}) {
      this.loading = true;
      this.error = null;

      try {
        const response = await ticketService.getTickets(params);

        if (response.success) {
          // Transform the data to match frontend expectations
          this.tickets = response.tickets.map((ticket) => ({
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            status: ticket.status,
            priority: ticket.priority,
            category: ticket.category_name || "Uncategorized",
            category_id: ticket.category_id,
            user: ticket.created_by_name || "Unknown User",
            created_at: ticket.created_at,
            updated_at: ticket.updated_at,
            assigned_to: ticket.assigned_to_name,
          }));

          this.initialized = true;
          this.saveTicketsToStorage();

          // Update pagination from response
          this.pagination = {
            current_page: response.pagination?.page || 1,
            last_page: response.pagination?.total_pages || 1,
            per_page: response.pagination?.per_page || 15,
            total: response.pagination?.total || this.tickets.length,
          };

          console.log(
            "Successfully fetched tickets from API:",
            this.tickets.length
          );
          return { data: this.tickets, meta: this.pagination };
        } else {
          throw new Error(response.message || "Failed to fetch tickets");
        }
      } catch (error) {
        console.error("API fetch failed, using localStorage fallback:", error);

        // Fallback to localStorage if API fails
        const storedTickets = JSON.parse(
          localStorage.getItem("tickets") || "[]"
        );
        if (storedTickets.length > 0) {
          this.tickets = storedTickets;
          this.initialized = true;
          this.pagination.total = this.tickets.length;
          return { data: this.tickets, meta: this.pagination };
        }

        this.error = "Failed to fetch tickets from server";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTicket(id) {
      this.loading = true;
      this.error = null;

      try {
        // First try to find existing ticket in the tickets array
        let foundTicket = this.tickets.find((t) => t.id === parseInt(id));

        if (!foundTicket) {
          // Create mock ticket data if not found
          foundTicket = {
            id: parseInt(id),
            title: "Login Issue with Safari Browser",
            description:
              "I am experiencing login issues specifically when using Safari browser. The login form appears to submit but then redirects back to the login page without any error message.",
            status: "open",
            priority: "medium",
            category: "Technical Support",
            category_id: 1,
            user: "John Doe",
            created_at: "2024-11-15T10:30:00Z",
            updated_at: "2024-11-15T14:22:00Z",
            attachments: [
              { id: 1, name: "screenshot.png", url: "#" },
              { id: 2, name: "browser-console.txt", url: "#" },
            ],
          };
          // Add to tickets array for persistence
          this.tickets.unshift(foundTicket);
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 400));

        this.currentTicket = foundTicket;
        return { data: foundTicket };
      } catch (error) {
        this.error = "Failed to fetch ticket";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createTicket(ticketData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await ticketService.createTicket(ticketData);

        if (response.success) {
          // Refresh tickets list to include the new ticket
          await this.fetchTickets();
          toast.success("Ticket created successfully!");
          return response;
        } else {
          throw new Error(response.message || "Failed to create ticket");
        }
      } catch (error) {
        this.error = "Failed to create ticket";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateTicket(id, ticketData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await ticketService.updateTicket(id, ticketData);

        if (response.success) {
          // Update in local tickets array
          const index = this.tickets.findIndex((t) => t.id === parseInt(id));
          if (index !== -1) {
            // Refresh the ticket data from server
            await this.fetchTickets();
          }

          // Update current ticket if it's the same
          if (this.currentTicket?.id === parseInt(id)) {
            this.currentTicket = {
              ...this.currentTicket,
              ...ticketData,
            };
          }

          toast.success("Ticket updated successfully!");
          return response;
        } else {
          throw new Error(response.message || "Failed to update ticket");
        }
      } catch (error) {
        this.error = "Failed to update ticket";
        toast.error(this.error);
        console.error("Update ticket error:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteTicket(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await ticketService.deleteTicket(id);

        if (response.success) {
          // Remove from local tickets array
          this.tickets = this.tickets.filter((t) => t.id !== parseInt(id));

          // Clear current ticket if it's the same
          if (this.currentTicket?.id === parseInt(id)) {
            this.currentTicket = null;
          }

          // Update pagination
          this.pagination.total = this.tickets.length;
          this.saveTicketsToStorage();
          toast.success("Ticket deleted successfully!");
          return response;
        } else {
          throw new Error(response.message || "Failed to delete ticket");
        }
      } catch (error) {
        this.error = "Failed to delete ticket";
        toast.error(this.error);
        console.error("Delete ticket error:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchTicketStats() {
      try {
        const response = await ticketService.getTicketStats();
        this.stats = response.data;
        return response;
      } catch (error) {
        console.error("Failed to fetch ticket stats:", error);
        // Return default stats on error
        return {
          data: {
            total: 0,
            resolved: 0,
            in_progress: 0,
            high_priority: 0,
            open: 0,
            closed: 0,
            this_week: 0,
            last_week: 0,
          },
        };
      }
    },

    async fetchActivityLogs(ticketId) {
      try {
        const response = await ticketService.getActivityLogs(ticketId);
        this.activityLogs = response.data;
        return response;
      } catch (error) {
        console.error("Failed to fetch activity logs:", error);
      }
    },

    async assignTicket(ticketId, userId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await ticketService.assignTicket(ticketId, userId);

        // Update in tickets array
        const index = this.tickets.findIndex(
          (t) => t.id === parseInt(ticketId)
        );
        if (index !== -1) {
          this.tickets[index] = response.data;
        }

        // Update current ticket if it's the same
        if (this.currentTicket?.id === parseInt(ticketId)) {
          this.currentTicket = response.data;
        }

        toast.success("Ticket assignment updated!");
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to assign ticket";
        toast.error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearCurrentTicket() {
      this.currentTicket = null;
      this.activityLogs = [];
    },
  },
});
