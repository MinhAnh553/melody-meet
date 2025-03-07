import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
// instance.interceptors.response.use(
//     function (response) {
//         if (response && response.data) {
//             return response.data;
//         }
//         return response;
//     },
//     function (error) {
//         // Nếu có phản hồi từ server
//         if (error?.response) {
//             return Promise.reject(error);
//         }
//         return Promise.reject(new Error('Lỗi không xác định'));
//     },
// );

instance.interceptors.response.use(
    function (response) {
        return response?.data ?? response;
    },
    function (error) {
        if (error.response && error.response.status === 401) {
            const requestUrl = error.config.url;

            if (!requestUrl.includes('/api/v1/user/account')) {
                window.location.href = '/';
            }
        }

        if (error?.response?.data) return error?.response?.data;
        return Promise.reject(error);
    },
);

export default instance;
