import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

// Interceptor to handle token expiration or unauthorized access
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 419)
    ) {
      // Redirect to login or handle session expiration
      // This is a simple example; you might want to handle this more gracefully
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
