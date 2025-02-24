import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

import swalCustomize from '../../util/swalCustomize';
import LoadingSpinner from './loading/LoadingSpinner';

const ProtectedRoute = () => {
    const { loading, auth } = useAuth();

    if (loading) return <LoadingSpinner />;

    if (!auth?.isAuthenticated) {
        swalCustomize.Toast.fire({
            icon: 'error',
            title: 'Vui lòng đăng nhập!',
        });

        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
