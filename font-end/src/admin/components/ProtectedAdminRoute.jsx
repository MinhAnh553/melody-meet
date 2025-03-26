import { useAuth } from '../../client/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

import swalCustomize from '../../util/swalCustomize';
import LoadingSpinner from '../../client/components/loading/LoadingSpinner';

const ProtectedAdminRoute = () => {
    const { loading, auth } = useAuth();

    if (loading) return <LoadingSpinner />;

    if (!auth?.isAuthenticated || auth.user.role !== 'admin') {
        swalCustomize.Toast.fire({
            icon: 'error',
            title: 'Không đủ quyền hạn!',
        });
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedAdminRoute;
