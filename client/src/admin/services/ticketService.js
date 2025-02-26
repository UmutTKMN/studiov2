import api from "./api";

export const ticketService = {
  // Users
  getUserTickets: () => api.get("/tickets/my-tickets"),
  getUserTicketDetails: (id) => api.get(`/tickets/user-ticket/${id}`),
  
  // Admin
  getAllTickets: () => api.get("/tickets"),
  getTicketDetails: (id) => api.get(`/tickets/${id}`),
  updateTicketStatus: (id, status) => api.patch(`/tickets/${id}/status`, { status }),
  deleteTicket: (id) => api.delete(`/tickets/${id}`),
  getAdminUsers: async () => await api.get('/auth/staff-teams'),
  
  // Ticket Messages
  addMessage: (ticketId, data) => api.post(`/tickets/${ticketId}/messages`, data),
  getMessages: (ticketId) => api.get(`/tickets/${ticketId}/messages`),
  markMessageAsRead: (messageId) => api.patch(`/tickets/messages/${messageId}/read`),
  
  // Ticket Assignment
  assignTicket: (ticketId, data) => api.patch(`/tickets/${ticketId}/assign`, data),
  
  // Public
  getCategories: () => api.get("/tickets/categories"),
  createTicket: (data) => api.post("/tickets", data),
};
