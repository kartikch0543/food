import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://food-xjyt.onrender.com/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export const api = {
    auth: {
        async login({ email, password }) {
            const response = await axiosInstance.post('/auth/login', { email, password });
            return { token: response.data.token, user: response.data };
        },
        async register({ name, email, password, role }) {
            const response = await axiosInstance.post('/auth/register', { name, email, password, role });
            return { token: response.data.token, user: response.data };
        }
    },
    restaurants: {
        async getAll() {
            const response = await axiosInstance.get('/restaurants');
            return response.data;
        },
        async getById(id) {
            const response = await axiosInstance.get(`/restaurants/${id}`);
            return response.data;
        },
        async create(data) {
            const isFormData = data instanceof FormData;
            const response = await axiosInstance.post('/restaurants', data, {
                headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
            });
            return response.data;
        },
        async update(id, data) {
            const isFormData = data instanceof FormData;
            const response = await axiosInstance.put(`/restaurants/${id}`, data, {
                headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
            });
            return response.data;
        },
        async delete(id) {
            await axiosInstance.delete(`/restaurants/${id}`);
        }
    },
    foods: {
        async getByRestaurant(restaurantId) {
            const response = await axiosInstance.get(`/foods/${restaurantId}`);
            return response.data;
        },
        async create(restaurantId, data) {
            const isFormData = data instanceof FormData;
            const response = await axiosInstance.post(`/foods/${restaurantId}`, data, {
                headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
            });
            return response.data;
        },
        async update(id, data) {
            const isFormData = data instanceof FormData;
            const response = await axiosInstance.put(`/foods/${id}`, data, {
                headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
            });
            return response.data;
        },
        async delete(id) {
            await axiosInstance.delete(`/foods/${id}`);
        }
    },
    cart: {
        async get() {
            const response = await axiosInstance.get('/cart');
            return response.data;
        },
        async addItem(foodId, quantity = 1) {
            const response = await axiosInstance.post('/cart/add', { foodId, quantity });
            return response.data;
        },
        async removeItem(foodId) {
            const response = await axiosInstance.delete(`/cart/remove/${foodId}`);
            return response.data;
        },
        async clear() {
            await axiosInstance.delete('/cart/clear');
        }
    },
    orders: {
        async create(data) {
            const response = await axiosInstance.post('/orders', data);
            return response.data;
        },
        async getUserOrders() {
            const response = await axiosInstance.get('/orders/user');
            return response.data;
        },
        async getAll() {
            const response = await axiosInstance.get('/orders/admin');
            return response.data;
        },
        async updateStatus(id, status) {
            const response = await axiosInstance.put(`/orders/${id}/status`, { status });
            return response.data;
        },
        async cancelOrder(id) {
            const response = await axiosInstance.put(`/orders/${id}/cancel`);
            return response.data;
        },
        async submitFeedback(id, { rating, feedback }) {
            const response = await axiosInstance.post(`/orders/${id}/feedback`, { rating, feedback });
            return response.data;
        }
    },
    admin: {
        async getStats() {
            const response = await axiosInstance.get('/admin/stats');
            return response.data;
        }
    }
};
