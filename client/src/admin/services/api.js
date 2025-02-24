import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    if (authData?.token) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Yenileme token'ı ile yeni token al
        const refreshToken = JSON.parse(
          localStorage.getItem("authData")
        )?.refreshToken;
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
            {
              refreshToken,
            }
          );

          if (response.data.token) {
            localStorage.setItem("authData", JSON.stringify(response.data));
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${response.data.token}`;
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${response.data.token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token yenileme hatası:", refreshError);
      }

      // Yenileme başarısız olursa çıkış yap
      localStorage.removeItem("authData");
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default api;
