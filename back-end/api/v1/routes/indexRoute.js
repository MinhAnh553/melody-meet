import express from 'express';
import { userRoute } from './userRoute.js';
import authMiddleware from '../../../middlewares/client/authMiddleware.js';

const Router = express.Router();

Router.use(authMiddleware.isAuthorized);

Router.use('/checkAPI', (req, res) => {
    res.status(200).json('Hello World!');
});

Router.use('/user', userRoute);

export default Router;
