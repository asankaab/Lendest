
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
<<<<<<< HEAD
import { AuthContext } from '../contexts/context';
=======
import { AuthContext } from '../context/context';
>>>>>>> 13af10e341f71a153942c64c6efba3ad96e05558

export default function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="flex items-center center" style={{ height: '100vh', justifyContent: 'center' }}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}
