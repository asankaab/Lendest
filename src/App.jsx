import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import InstallPrompt from './components/InstallPrompt';
import RouteLoadingFallback from './components/RouteLoadingFallback';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const People = lazy(() => import('./pages/People'));
const PersonDetails = lazy(() => import('./pages/PersonDetails'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Settings = lazy(() => import('./pages/Settings'));
const PersonalInformation = lazy(() => import('./pages/PersonalInformation'));
const CurrencySettings = lazy(() => import('./pages/CurrencySettings'));

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
                element: <Suspense fallback={<RouteLoadingFallback />}><Dashboard /></Suspense>,
                loader: dashboardLoader,
            },
            {
                path: "/people",
                element: <Suspense fallback={<RouteLoadingFallback />}><People /></Suspense>,
                loader: peopleLoader,
            },
            {
                path: "/people/:username",
                element: <Suspense fallback={<RouteLoadingFallback />}><PersonDetails /></Suspense>,
                loader: personDetailsLoader,
            },
            {
                path: "/transactions",
                element: <Suspense fallback={<RouteLoadingFallback />}><Transactions /></Suspense>,
                loader: transactionsLoader,
            },
            {
                path: "/settings",
                element: <Suspense fallback={<RouteLoadingFallback />}><Settings /></Suspense>,
            },
            {
                path: "/settings/personal-information",
                element: <Suspense fallback={<RouteLoadingFallback />}><PersonalInformation /></Suspense>,
            },
            {
                path: "/settings/currency",
                element: <Suspense fallback={<RouteLoadingFallback />}><CurrencySettings /></Suspense>,
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
