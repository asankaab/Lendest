import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const user = null;

    if (user) {
        return <div className="flex items-center center" style={{ height: '100vh', justifyContent: 'center' }}><img src='/lendest-icon.png'/></div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}
