import axios from './axiosCustomize';

const sendOTP = (email) => {
    const URL_API = '/api/v1/user/send-otp';

    return axios.post(URL_API, email);
};

const verifyOTPAndRegister = (email, otp, password) => {
    const URL_API = '/api/v1/user/verify-otp';
    const data = {
        email,
        otp,
        password,
    };

    return axios.post(URL_API, data);
};

const login = (email, password) => {
    const URL_API = '/api/v1/user/login';
    const data = {
        email,
        password,
    };

    return axios.post(URL_API, data);
};

const getAccount = () => {
    const URL_API = '/api/v1/user/account';

    return axios.get(URL_API);
};

const createEvent = (data) => {
    const URL_API = '/api/v1/event/create';
    return axios.post(URL_API, data);
};

const getEvents = (data) => {
    const URL_API = '/api/v1/event';
    return axios.get(URL_API);
};

export default {
    sendOTP,
    verifyOTPAndRegister,
    login,
    getAccount,
    createEvent,
    getEvents,
};
