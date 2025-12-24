
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import People from './pages/People';
import PersonDetails from './pages/PersonDetails';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import PersonalInformation from './pages/PersonalInformation';
import CurrencySettings from './pages/CurrencySettings';
import Passkeys from './pages/Passkeys';
import { Auth0Provider } from '@auth0/auth0-react';
import { variables } from './lib/env';

function App() {

    return (
        <BrowserRouter>
                <Auth0Provider domain={variables.auth0Domain} clientId={variables.clientId}
                        authorizationParams={{
                            redirect_uri: window.location.origin
                        }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/people" element={<People />} />
                            <Route path="/people/:username" element={<PersonDetails />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/settings/personal-information" element={<PersonalInformation />} />
                            <Route path="/settings/passkeys" element={<Passkeys />} />
                            <Route path="/settings/currency" element={<CurrencySettings />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Auth0Provider>
        </BrowserRouter>
    );
}

export default App;
