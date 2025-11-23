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
        // Fetch tickets from PHP API
        const response = await fetch(
          "http://localhost/ticketing-website/backend/api/tickets.php"
        );
        const result = await response.json();

        if (result.success) {
          // Transform the data to match frontend expectations
          this.tickets = result.data.map((ticket) => ({
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
          this.saveTicketsToStorage(); // Also save to localStorage as backup

          // Update pagination
          this.pagination = {
            current_page: 1,
            last_page: 1,
            per_page: params.per_page || 15,
            total: this.tickets.length,
          };

          console.log(
            "Successfully fetched tickets from API:",
            this.tickets.length
          );
          return { data: this.tickets, meta: this.pagination };
        } else {
          throw new Error(result.message || "Failed to fetch tickets");
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
        // Mock categories for lookup
        const categories = [
          { id: 1, name: "Technical Support" },
          { id: 2, name: "Billing" },
          { id: 3, name: "General Inquiry" },
          { id: 4, name: "Bug Report" },
          { id: 5, name: "Feature Request" },
        ];

        const selectedCategory = categories.find(
          (cat) => cat.id == ticketData.category_id
        );

        // Mock ticket creation
        const newTicket = {
          id: Date.now(), // Simple ID generation
          title: ticketData.title,
          description: ticketData.description,
          status: "open",
          priority: ticketData.priority || "medium",
          category: selectedCategory
            ? selectedCategory.name
            : "General Inquiry",
          category_id: parseInt(ticketData.category_id) || 3,
          user: "Current User",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        this.tickets.unshift(newTicket);
        // Update pagination
        this.pagination.total = this.tickets.length;
        this.saveTicketsToStorage(); // Save to localStorage
        toast.success("Ticket created successfully!");
        return { data: newTicket };
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
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 400));

        const parsedId = parseInt(id);
        const updateData = {
          ...ticketData,
          updated_at: new Date().toISOString(),
        };

        // Update in tickets array
        const index = this.tickets.findIndex((t) => t.id === parsedId);
        if (index !== -1) {
          this.tickets[index] = {
            ...this.tickets[index],
            ...updateData,
          };

          console.log("Ticket updated in store:", this.tickets[index]);
        } else {
          // If ticket not found in array, create it
          const newTicket = {
            id: parsedId,
            user: "Current User",
            created_at: new Date().toISOString(),
            ...updateData,
          };
          this.tickets.unshift(newTicket);
          console.log("New ticket created in store:", newTicket);
        }

        // Update current ticket if it's the same
        if (this.currentTicket?.id === parsedId) {
          this.currentTicket = {
            ...this.currentTicket,
            ...updateData,
          };
        }

        // Update pagination
        this.pagination.total = this.tickets.length;
        this.saveTicketsToStorage(); // Save to localStorage
        toast.success("Ticket updated successfully!");
        const updatedTicket = this.tickets.find((t) => t.id === parsedId);
        return { data: updatedTicket };
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
      console.log("Store deleteTicket called with ID:", id);
      this.loading = true;
      this.error = null;

      try {
        const parsedId = parseInt(id);
        console.log("Parsed ID:", parsedId);
        console.log("Tickets before delete:", this.tickets.length);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Remove from tickets array
        const originalLength = this.tickets.length;
        this.tickets = this.tickets.filter((t) => t.id !== parsedId);
        console.log("Tickets after delete:", this.tickets.length);
        console.log(
          "Deleted tickets count:",
          originalLength - this.tickets.length
        );

        // Clear current ticket if it's the same
        if (this.currentTicket?.id === parsedId) {
          this.currentTicket = null;
          console.log("Cleared current ticket");
        }

        // Update pagination
        this.pagination.total = this.tickets.length;
        this.saveTicketsToStorage(); // Save to localStorage
        console.log("Attempting to show success toast...");

        try {
          toast.success("Ticket deleted successfully!");
          console.log("Success toast shown successfully");
        } catch (toastError) {
          console.error("Error showing toast:", toastError);
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
        // Fetch stats from backend API
        const response = await fetch(
          "http://localhost/ticketing-website/backend/api/stats.php"
        );
        const result = await response.json();

        if (result.success) {
          this.stats = result.data;
          return { data: result.data };
        } else {
          throw new Error(result.message || "Failed to fetch stats");
        }
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
