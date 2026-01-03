import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InstallPrompt from './components/InstallPrompt';

import People from './pages/People';
import PersonDetails from './pages/PersonDetails';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import PersonalInformation from './pages/PersonalInformation';
import CurrencySettings from './pages/CurrencySettings';
import { AuthProvider } from './contexts/AuthProvider';
import { dashboardLoader, peopleLoader, personDetailsLoader, transactionsLoader } from './lib/loaders';

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/",
                element: <Dashboard />,
                loader: dashboardLoader,
            },
            {
                path: "/people",
                element: <People />,
                loader: peopleLoader,
            },
            {
                path: "/people/:username",
                element: <PersonDetails />,
                loader: personDetailsLoader,
            },
            {
                path: "/transactions",
                element: <Transactions />,
                loader: transactionsLoader,
            },
            {
                path: "/settings",
                element: <Settings />,
            },
            {
                path: "/settings/personal-information",
                element: <PersonalInformation />,
            },
            {
                path: "/settings/currency",
                element: <CurrencySettings />,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    }
]);

function App() {
    return (
        <AuthProvider>
            <InstallPrompt />
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
