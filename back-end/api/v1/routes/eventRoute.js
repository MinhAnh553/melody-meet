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

Router.route('/update/:id/status').patch(
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    eventController.updateStatusEvent,
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

Router.route('/all-events').get(
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    eventController.getAllEvents,
);

Router.route('/my').get(
    authMiddleware.isAuthorized,
    eventController.getMyEvents,
);

Router.route('/search').get(
    authMiddleware.isAuthorized,
    eventController.eventSearch,
);

Router.route('/:id/orders').get(
    authMiddleware.isAuthorized,
    eventController.getOrdersByEventId,
);

Router.route('/:id/summary').get(
    authMiddleware.isAuthorized,
    eventController.getEventSummary,
);

Router.route('/:id/edit').get(
    authMiddleware.isAuthorized,
    eventController.getEventByIdToEdit,
);

Router.route('/:id').get(eventController.getEventById);

export const eventRoute = Router;
