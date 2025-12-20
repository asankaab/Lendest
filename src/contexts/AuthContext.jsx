
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

const AuthContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState('USD');

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const loadProfile = async () => {
            if (!user?.id) return;
            const profile = await api.getProfile(user?.id);
            setCurrency(profile.currency.toUpperCase());
        };

        loadProfile();

        return () => {
            subscription.unsubscribe();
            loadProfile();
        };
    }, [user?.id]);

    const value = {
        signInWithGoogle: () => supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: import.meta.env.VITE_SITE_URL } }),
        signInWithPassword: (email, password) => supabase.auth.signInWithPassword({ email, password }),
        signUpWithPassword: (email, password) => supabase.auth.signUp({ email, password }),
        signOut: () => supabase.auth.signOut(),
        user,
        loading,
        currency,
        setCurrency: (newCurrency) => {
            setCurrency(newCurrency);
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
