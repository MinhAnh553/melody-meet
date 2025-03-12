import express from 'express';
import eventController from '../../../controllers/client/eventController.js';
import uploadCloudProvider from '../../../providers/uploadCloudProvider.js';
import authMiddleware from '../../../middlewares/client/authMiddleware.js';

const Router = express.Router();

// Router.use(authMiddleware.isAuthorized);

Router.route('/create').post(
    authMiddleware.isAuthorized,
    uploadCloudProvider.fields([
        // { name: 'eventLogo', maxCount: 1 },
        { name: 'eventBackground', maxCount: 1 },
        { name: 'organizerLogo', maxCount: 1 },
        { name: 'ticketImages', maxCount: 10 },
    ]),
    eventController.createEvent,
);

Router.route('/').get(eventController.getEvents);

Router.route('/my').get(
    authMiddleware.isAuthorized,
    eventController.getMyEvents,
);

Router.route('/:id/orders').get(
    authMiddleware.isAuthorized,
    eventController.getOrdersByEventId,
);

Router.route('/:id').get(eventController.getEventById);

export const eventRoute = Router;
