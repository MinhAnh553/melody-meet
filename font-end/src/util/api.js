import axios from './axiosCustomize';

const API_URL = '/api/v1';

const sendOTP = (email) => {
    const URL_API = `${API_URL}/user/send-otp`;

    return axios.post(URL_API, email);
};

const verifyOTPAndRegister = (email, otp, password) => {
    const URL_API = `${API_URL}/user/verify-otp`;
    const data = {
        email,
        otp,
        password,
    };

    return axios.post(URL_API, data);
};

const login = (email, password) => {
    const URL_API = `${API_URL}/user/login`;
    const data = {
        email,
        password,
    };

    return axios.post(URL_API, data);
};

const getAccount = () => {
    const URL_API = `${API_URL}/user/account`;

    return axios.get(URL_API);
};

const createEvent = (data) => {
    const URL_API = `${API_URL}/event/create`;
    return axios.post(URL_API, data);
};

const getEventById = (id) => {
    const URL_API = `${API_URL}/event/${id}`;
    return axios.get(URL_API);
};

const getEvents = () => {
    const URL_API = `${API_URL}/event`;
    return axios.get(URL_API);
};

const updateUserInfo = (data) => {
    const URL_API = `${API_URL}/user/update`;
    return axios.patch(URL_API, data);
};

const createOrder = (data) => {
    const URL_API = `${API_URL}/order/create`;
    return axios.post(URL_API, data);
};

const updateOrder = (data) => {
    const URL_API = `${API_URL}/order/update`;
    return axios.patch(URL_API, data);
};

const getOrder = (id) => {
    const URL_API = `${API_URL}/order/${id}`;
    return axios.get(URL_API);
};

const selectPayment = (id, method) => {
    const URL_API = `${API_URL}/order/${id}/select-payment?method=${method}`;
    return axios.post(URL_API);
};

const checkOrder = (data) => {
    const URL_API = `${API_URL}/order/check-order`;
    return axios.post(URL_API, data);
};

const getOrderByOrderId = (orderId) => {
    const URL_API = `${API_URL}/order/success/${orderId}`;
    return axios.get(URL_API);
};

export default {
    sendOTP,
    verifyOTPAndRegister,
    login,
    getAccount,
    createEvent,
    getEventById,
    getEvents,
    updateUserInfo,
    createOrder,
    updateOrder,
    getOrder,
    selectPayment,
    checkOrder,
    getOrderByOrderId,
};
