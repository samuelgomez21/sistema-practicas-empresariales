import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store global del tema.
 * Persiste en localStorage para mantener la preferencia entre sesiones.
 */
export const useThemeStore = create(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    { name: 'practicas-uah-theme' }
  )
)