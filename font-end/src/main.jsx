import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css'; // CSS Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // Icons Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // JS Bootstrap
import './assets/css/global.css';

import router from './router/routes.jsx';
import { AuthProvider } from './client/context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>,
    // </React.StrictMode>,
);
