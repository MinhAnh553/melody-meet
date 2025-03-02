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

const getEvents = (data) => {
    const URL_API = `${API_URL}/event`;
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
};
