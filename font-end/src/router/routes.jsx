import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import ClientLayout from '../client/layout/ClientLayout.jsx';
import HomePage from '../client/pages/home/HomePage.jsx';
import EventManagementLayout from '../client/layout/EventManagementLayout.jsx';
import ProtectedRoute from '../client/components/ProtectedRoute';
import EventCreateWizard from '../client/pages/event/EventCreateWizard.jsx';
import EventDetail from '../client/pages/event/EventDetail.jsx';
import PaymentSuccess from '../client/pages/payment/PaymentSuccess.jsx';
import OrderPage from '../client/pages/payment/OrderPage.jsx';
import PurchasedTickets from '../client/pages/PurchasedTickets.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ClientLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'my-tickets',
                element: <PurchasedTickets />,
            },
        ],
    },
    {
        path: 'event',
        element: <ProtectedRoute />,
        children: [
            {
                element: <EventManagementLayout />,
                children: [
                    {
                        path: 'create',
                        element: <EventCreateWizard />,
                    },
                ],
            },
        ],
    },
    {
        path: '/event/:eventId',
        element: <ClientLayout />,
        children: [
            {
                index: true,
                element: <EventDetail />,
            },
        ],
    },
    {
        path: '/order',
        children: [
            {
                path: 'payment-success',
                element: <PaymentSuccess />,
            },
            {
                path: ':orderId',
                element: <OrderPage />,
            },
        ],
    },
]);

export default router;
