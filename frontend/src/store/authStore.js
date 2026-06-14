import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/features/auth/api/authApi'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user:  null, // { id, email, nombre, rol }
      isAuthenticated: false,

      login: async (email, password) => {
        const data = await authApi.login(email, password)
        set({
          token: data.token,
          user:  {
            id:     data.id,       // ← agregar
            email:  data.email,
            nombre: data.nombre,
            rol:    data.rol,
          },
          isAuthenticated: true,
        })
        return data
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    { name: 'auth-storage' }
  )
)