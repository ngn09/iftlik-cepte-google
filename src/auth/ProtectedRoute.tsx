
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

const ProtectedRoute = () => {
    const { session, profile, loading } = useAuth();

    if (loading) {
        return null; // AuthProvider shows a loading screen
    }

    if (!session) {
        return <Navigate to="/auth" replace />;
    }

    if (!profile?.farm_id) {
        return <Navigate to="/farm-setup" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
