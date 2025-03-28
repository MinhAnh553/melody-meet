import express from 'express';
import adminController from '../../../controllers/client/adminController.js';
import authMiddleware from '../../../middlewares/client/authMiddleware.js';

const Router = express.Router();

Router.route('/dashboard').get(
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    adminController.getDashboard,
);

export const adminRoute = Router;
