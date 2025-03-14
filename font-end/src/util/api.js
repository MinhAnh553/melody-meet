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

const updateEvent = (eventId, data) => {
    const URL_API = `${API_URL}/event/update/${eventId}`;
    return axios.patch(URL_API, data);
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

const cancelOrder = (id) => {
    const URL_API = `${API_URL}/order/cancel`;
    return axios.post(URL_API, id);
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

const getMyOrders = (page = 1, limit = 5) => {
    const URL_API = `${API_URL}/order/my?page=${page}&limit=${limit}`;
    return axios.get(URL_API);
};

const getOrderTickets = (id) => {
    const URL_API = `${API_URL}/order/ticket/${id}`;
    return axios.get(URL_API);
};

const getMyEvents = (
    page = 1,
    limit = 5,
    status = 'approved',
    isFinished = false,
) => {
    const URL_API = `${API_URL}/event/my?page=${page}&limit=${limit}&status=${status}&isFinished=${isFinished}`;
    return axios.get(URL_API);
};

const getOrdersByEventId = (id) => {
    const URL_API = `${API_URL}/event/${id}/orders`;
    return axios.get(URL_API);
};

export default {
    sendOTP,
    verifyOTPAndRegister,
    login,
    getAccount,
    createEvent,
    updateEvent,
    getEventById,
    getEvents,
    updateUserInfo,
    createOrder,
    cancelOrder,
    getOrder,
    selectPayment,
    checkOrder,
    getOrderByOrderId,
    getMyOrders,
    getOrderTickets,
    getMyEvents,
    getOrdersByEventId,
};
