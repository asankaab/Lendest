
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem('lendbook_currency') || 'USD';
    });

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

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        signInWithGoogle: () => supabase.auth.signInWithOAuth({ provider: 'google' }),
        signInWithPassword: (email, password) => supabase.auth.signInWithPassword({ email, password }),
        signUpWithPassword: (email, password) => supabase.auth.signUp({ email, password }),
        signOut: () => supabase.auth.signOut(),
        user,
        loading,
        currency,
        setCurrency: (newCurrency) => {
            setCurrency(newCurrency);
            localStorage.setItem('lendbook_currency', newCurrency);
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
