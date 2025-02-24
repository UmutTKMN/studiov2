import api from './api';

export const userService = {
  getAllUsers: async (page = 1, limit = 20, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Temel parametreler
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      // Filtreleme parametreleri
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, value);
        }
      });
      const url = `/auth/users?${queryParams.toString()}`;

      const response = await api.get(url);
      if (!response.data.success) {
        throw new Error(response.data.message || "Kullanıcılar getirilemedi");
      }

      return {
        users: response.data.users || [],
        pagination: {
          total: response.data.total || 0,
          page: response.data.page || page,
          totalPages: response.data.totalPages || 0,
          limit: response.data.limit || limit,
        },
      };
    } catch (error) {
      console.error("User Service Error:", error);
      throw new Error(
        error.response?.data?.message ||
          "Kullanıcılar yüklenirken bir hata oluştu"
      );
    }
  },
}; 