import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// ── Create Axios Instance ────────────────────────────────
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // kirim httpOnly cookie (refresh token)
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Type': 'web',
  },
  timeout: 15000,
});

// ── Request Interceptor ──────────────────────────────────
// Inject access token dari memory (Zustand store) ke setiap request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Token diambil dari Zustand store (in-memory, bukan localStorage)
    if (typeof window !== 'undefined') {
      const token = getAccessTokenFromStore();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ─────────────────────────────────
// Handle 401 → auto refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika 401 dan bukan request refresh itu sendiri
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        // Queue request lain yang datang saat sedang refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await apiClient.post('/auth/refresh');
        const newToken = response.data?.data?.accessToken;

        if (newToken) {
          setAccessTokenInStore(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh gagal → redirect ke login
        clearAuthStore();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ── Store Helpers ────────────────────────────────────────
// Circular dependency dihindari dengan lazy import dari Zustand
function getAccessTokenFromStore(): string | null {
  try {
    // Dynamic access ke Zustand store tanpa import langsung
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store = (globalThis as any).__simsAuthStore;
    return store?.getState()?.accessToken ?? null;
  } catch {
    return null;
  }
}

function setAccessTokenInStore(token: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store = (globalThis as any).__simsAuthStore;
    store?.getState()?.setAccessToken(token);
  } catch {
    // silent fail
  }
}

function clearAuthStore() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const store = (globalThis as any).__simsAuthStore;
    store?.getState()?.logout();
  } catch {
    // silent fail
  }
}

export default apiClient;
