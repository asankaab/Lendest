
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
import { useContext } from 'react';
import { ThemeContext } from './contexts/AppContext';

function App() {

    const theme = useContext(ThemeContext);
    
    const mode = theme.theme === 'dark' ? 'on' : 'off';

    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}

export default App;
