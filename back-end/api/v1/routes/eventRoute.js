import express from 'express';
import eventController from '../../../controllers/client/eventController.js';
import uploadCloudProvider from '../../../providers/uploadCloudProvider.js';
import authMiddleware from '../../../middlewares/client/authMiddleware.js';

const Router = express.Router();

Router.route('/create').post(
    authMiddleware.isAuthorized,
    uploadCloudProvider.fields([
        { name: 'eventBackground', maxCount: 1 },
        { name: 'organizerLogo', maxCount: 1 },
    ]),
    eventController.createEvent,
);

Router.route('/update/:id').patch(
    authMiddleware.isAuthorized,
    uploadCloudProvider.fields([
        { name: 'eventBackground', maxCount: 1, minCount: 0 },
        { name: 'organizerLogo', maxCount: 1, minCount: 0 },
    ]),
    eventController.updateEvent,
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

Router.route('/:id/summary').get(
    authMiddleware.isAuthorized,
    eventController.getEventSummary,
);

Router.route('/:id').get(eventController.getEventById);

export const eventRoute = Router;
