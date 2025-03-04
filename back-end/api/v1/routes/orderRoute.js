import express from 'express';
import orderController from '../../../controllers/client/orderController.js';
import authMiddleware from '../../../middlewares/client/authMiddleware.js';

const Router = express.Router();

Router.use(authMiddleware.isAuthorized);

Router.route('/create').post(orderController.createOrder);

Router.route('/update').patch(orderController.updateOrder);

Router.route('/:orderId').get(orderController.getOrder);

Router.route('/:orderId/select-payment').post(orderController.selectPayment);

Router.route('/check-order').post(orderController.checkOrder);

Router.route('/success/:orderId').get(orderController.getOrderSuccess);

export const orderRoute = Router;
