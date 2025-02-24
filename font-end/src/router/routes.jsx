import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import ClientLayout from '../client/layout/ClientLayout.jsx';
import HomePage from '../client/pages/HomePage.jsx';
import EventManagementLayout from '../client/layout/EventManagementLayout.jsx';
import SidebarEvent from '../client/components/SidebarEvent.jsx';
import ProtectedRoute from '../client/components/ProtectedRoute';

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
                        element: <div>Nội dung</div>,
                    },
                ],
            },
        ],
    },
]);

export default router;
