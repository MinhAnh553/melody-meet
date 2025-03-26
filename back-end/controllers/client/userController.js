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

// [GET] /user/account
const getAccount = async (req, res) => {
    try {
        const id = req.user.id;
        const result = await userService.getUserById(id);

        res.status(200).json({
            success: true,
            user: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

// [PATCH] /user/update
const updateInfoAccount = async (req, res) => {
    try {
        const id = req.user.id;
        const data = req.body;
        const result = await userService.updateById(id, data);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await userService.updateUser(id, data);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const result = await userService.getAllUsers();
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(404).json(result);
    } catch (error) {
        console.log(error);
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
    updateInfoAccount,
    getAllUsers,
    updateUser,
};
