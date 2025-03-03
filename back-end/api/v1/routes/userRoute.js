import express from 'express';
import userController from '../../../controllers/client/userController.js';
import authMiddleware from '../../../middlewares/client/authMiddleware.js';

const Router = express.Router();

Router.route('/send-otp').post(userController.sendOTP);

Router.route('/verify-otp').post(userController.verifyOTPAndRegister);

Router.route('/login').post(userController.loginUser);

Router.route('/account').get(
    authMiddleware.isAuthorized,
    userController.getAccount,
);

Router.route('/update').patch(
    authMiddleware.isAuthorized,
    userController.updateInfoAccount,
);

export const userRoute = Router;
