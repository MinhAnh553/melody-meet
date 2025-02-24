import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Register from '../components/Register';
import Login from '../components/Login';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/loading/LoadingSpinner';

function ClientLayout() {
    const { loading } = useAuth();

    return (
        <>
            {loading === true ? (
                <LoadingSpinner />
            ) : (
                <>
                    <Header />
                    <main>
                        <Outlet />
                    </main>
                    <Register />
                    <Login />
                    <Footer />
                </>
            )}
        </>
    );
}

export default ClientLayout;
