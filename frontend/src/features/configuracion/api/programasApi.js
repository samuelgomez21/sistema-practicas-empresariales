import api from '@/lib/axios'

export const programasApi = {
  getProgramas: async () => {
    const { data } = await api.get('/programas')
    return data
    // [{ id, nombre, ... }]
  },
}