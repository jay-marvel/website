import axios, { AxiosError } from 'axios';
import { getToken, clearToken } from '$stores/auth'; // Adjust the import path accordingly

// Create an Axios instance with default configuration
const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

const api = axios.create({
    baseURL: API_SERVER_URL, // Use environment variable for the base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the JWT token to headers if available
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const jwtToken = getToken(); // Retrieve token from local storage
            if (jwtToken) {
                config.headers['Authorization'] = `Bearer ${jwtToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error('Response error:', error.response.data);
                console.error('Status code:', error.response.status);
                // Handle specific error status codes or clear the token if unauthorized
                if (error.response.status === 401) {
                    clearToken();
                }
            } else if (error.request) {
                console.error('Request error:', error.request);
            } else {
                console.error('Axios error:', error.message);
            }
        } else {
            console.error('Unexpected error:', error);
        }
        return Promise.reject(error);
    }
);

export default api;