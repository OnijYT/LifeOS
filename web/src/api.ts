import axios from "axios"

export const api = axios.create({
    baseURL: 'http://localhost:5000/api'
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export const habitsApi = {
    getAll: async () => {
        const response = await api.get('/habits');
        return response.data;
    },
    toggleCheck: async (id: string, date: string) => {
        const response = await api.post(`/habits/${id}/check`, { targetDate: date });
        return response.data;
    }
};