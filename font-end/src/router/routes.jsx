import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import ClientLayout from '../client/layout/ClientLayout.jsx';
import HomePage from '../client/pages/home/HomePage.jsx';
import EventManagementLayout from '../client/layout/EventManagementLayout.jsx';
import ProtectedRoute from '../client/components/ProtectedRoute';
import EventCreateWizard from '../client/pages/event/EventCreateWizard.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ClientLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
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
]);

export default router;
