import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import { ThemeContext } from '../AppContext';

export const ThemeProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currency, setCurrency] = useState('USD');

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // useEffect(() => {
    //     // Check active sessions and sets the user
    //     supabase.auth.getSession().then(({ data: { session } }) => {
    //         setUser(session?.user ?? null);
    //         setLoading(false);
    //     });

    //     // Listen for changes on auth state (logged in, signed out, etc.)
    //     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    //         setUser(session?.user ?? null);
    //         setLoading(false);
    //     });

    //     const loadProfile = async () => {
    //         if (!user?.id) return;
    //         const profile = await api.getProfile(user?.id);
    //         setCurrency(profile.currency.toUpperCase());
    //     };

    //     loadProfile();

    //     return () => {
    //         subscription.unsubscribe();
    //         loadProfile();
    //     };
    // }, [user?.id]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const value = {
        theme,
        toggleTheme,
        loading
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};