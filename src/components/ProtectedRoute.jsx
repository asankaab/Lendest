
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center center" style={{ height: '100vh', justifyContent: 'center' }}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}
