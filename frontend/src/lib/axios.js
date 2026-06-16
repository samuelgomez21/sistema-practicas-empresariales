import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const api = axios.create({
  // HARDCODED para produccion y evitar bugs de Vercel con variables de entorno
  baseURL: 'https://sistema-practicas-empresariales.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',  // ← agregar esto
  },
})

// Inyecta el token en cada request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el token expira o es inválido, desloguea y redirige
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api