import express from 'express';
import orderController from '../../../controllers/client/orderController.js';
import authMiddleware from '../../../middlewares/client/authMiddleware.js';

const Router = express.Router();

Router.use(authMiddleware.isAuthorized);

Router.route('/create').post(orderController.createOrder);

Router.route('/cancel').post(orderController.cancelOrder);

Router.route('/:orderId/select-payment').post(orderController.selectPayment);

Router.route('/check-order').post(orderController.checkOrder);

Router.route('/success/:orderId').get(orderController.getOrderSuccess);

Router.route('/ticket/:orderId').get(orderController.getOrderTickets);

Router.route('/my').get(orderController.getMyOrders);

Router.route('/all-orders').get(
    authMiddleware.isAdmin,
    orderController.getAllOrders,
);

Router.route('/update/:id/status').patch(
    authMiddleware.isAdmin,
    orderController.updateStatusOrder,
);

Router.route('/:orderId').get(orderController.getOrder);

export const orderRoute = Router;
