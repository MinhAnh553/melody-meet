import userService from '../../services/client/userService.js';

// [POST] /user/send-otp
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const response = await userService.sendOTP(email);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

// [POST] /user/verify-otp
const verifyOTPAndRegister = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        const response = await userService.verifyOTPAndRegister(
            email,
            otp,
            password,
        );

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

// [POST] /user/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await userService.login(email, password);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

// [POST] /user/account
const getAccount = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

export default {
    sendOTP,
    verifyOTPAndRegister,
    loginUser,
    getAccount,
};
