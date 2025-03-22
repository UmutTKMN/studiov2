import api from './api';

export const activityLogService = {
  getUserActivity: (userId) => api.get(`/activity-logs/user/${userId}`),
  getTableActivity: (tableName) => api.get(`/activity-logs/table/${tableName}`),
  getRecentActivity: (page = 1, limit = 20, filters = {}) => {
    const queryParams = new URLSearchParams();

    // Temel parametreler
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    // Filtre parametreleri
    if (filters.action) {
      queryParams.append("action", filters.action);
    }
    if (filters.table) {
      queryParams.append("table", filters.table);
    }
    if (filters.sortBy) {
      queryParams.append("sortBy", filters.sortBy);
    }
    if (filters.search) {
      queryParams.append("search", filters.search);
    }

    const url = `/activity-logs/recent?${queryParams.toString()}`;

    return api.get(url);
  },
}; 