import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data) => api.post('/api/auth/register', data),
    login: (data) => api.post('/api/auth/login', data),
};

export const productAPI = {
    getAll: () => api.get('/api/products'),
    getById: (id) => api.get(`/api/products/${id}`),
    create: (data) => api.post('/api/products', data),
    update: (id, data) => api.put(`/api/products/${id}`, data),
    delete: (id) => api.delete(`/api/products/${id}`),
};

export const orderAPI = {
    create: (data) => api.post('/api/payment/orders', data),
    getAll: () => api.get('/api/payment/orders'),
    getById: (id) => api.get(`/api/payment/orders/${id}`),
    updateStatus: (id, data) => api.put(`/api/payment/orders/${id}`, data),
};

export const paymentAPI = {
    createIntent: (data) => api.post('/api/payment/create-payment-intent', data),
};

export const inventoryAPI = {
    checkAvailability: (data) => api.post('/api/inventory/check-availability', data),
    getLowStock: (threshold) => api.get(`/api/inventory/low-stock?threshold=${threshold}`),
    getOutOfStock: () => api.get('/api/inventory/out-of-stock'),
    bulkUpdate: (data) => api.post('/api/inventory/bulk-update', data),
};

export const uploadAPI = {
    uploadImage: (formData) => {
        return api.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export default api;
