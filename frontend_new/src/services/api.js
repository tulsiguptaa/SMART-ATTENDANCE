import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8008/api'

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Auth API - matches your backend routes
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile'),
}

// User API - matches your backend routes
export const userAPI = {
    getAllUsers: () => api.get('/users'),
    getUserById: (id) => api.get(`/users/${id}`),
    updateUser: (id, data) => api.put(`/users/${id}`, data),
    deleteUser: (id) => api.delete(`/users/${id}`),
}

// Attendance API - matches your backend routes
export const attendanceAPI = {
    markAttendance: (data) => api.post('/attendance/mark', data),
    getAllAttendance: () => api.get('/attendance'),
    getAttendanceById: (id) => api.get(`/attendance/${id}`),
    getUserAttendanceHistory: (userId) => api.get(`/attendance/user/${userId}`),
    getTodayAttendance: () => api.get('/attendance/today'),
    updateAttendance: (id, data) => api.put(`/attendance/${id}`, data),
    deleteAttendance: (id) => api.delete(`/attendance/${id}`),
}

// QR Code API for teachers
export const qrAPI = {
    generateQR: (data) => api.post('/qr/generate', data),
    validateQR: (qrCode) => api.post('/qr/validate', { qrCode }),
}

export default api
