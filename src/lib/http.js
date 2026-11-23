import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export const http = axios.create({
  baseURL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAdminPage = window.location.pathname.startsWith('/admin')
    const isLoginPage = window.location.pathname === '/admin/login'

    if (error.response?.status === 401 && isAdminPage && !isLoginPage) {
      window.location.assign('/admin/login')
    }

    return Promise.reject(error)
  },
)

export const getValidationErrors = (error) => error.response?.data?.errors ?? {}

export const getErrorMessage = (error, fallback = 'Terjadi kesalahan. Silakan coba lagi.') =>
  error.response?.data?.message ?? fallback
