import express from 'express';
import { userRoute } from './userRoute.js';
import { eventRoute } from './eventRoute.js';
import { orderRoute } from './orderRoute.js';
import { adminRoute } from './adminRoute.js';

const Router = express.Router();

Router.use('/checkAPI', (req, res) => {
    res.status(200).json('Hello World!');
});

Router.use('/user', userRoute);

Router.use('/event', eventRoute);

Router.use('/order', orderRoute);

Router.use('/admin', adminRoute);

export default Router;
