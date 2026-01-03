
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function Login() {
    const { signInWithGoogle, user, loading: authLoading, signInWithMagicLink } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [magicLinkSent, setMagicLinkSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user) {
            navigate('/');
        }
    }, [authLoading, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            setMagicLinkSent(false);
            setSuccessMessage('');

            const { error } = await signInWithMagicLink({
                email,
                options: {
                    emailRedirectTo: import.meta.env.VITE_SITE_URL
                }
            });
                if (error) throw error;
                setMagicLinkSent(true);
                setSuccessMessage('Successfully sent magic link! Check your email.');
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center center h-screen">
            <div className="glass" style={{ padding: '3rem', borderRadius: '1rem', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ marginBottom: '2rem', fontSize: '2rem', textAlign: 'center' }}>
                    Lendbook
                </h1>

                {error && <div style={{ color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {!error && magicLinkSent && (
                    <div style={{ color: 'var(--success)', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>
                        {successMessage}
                    </div>
                )}

                {!user ? <>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            required
                        />
                        <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontWeight: 'bold'
                        }}
                    >Sign In</button>
                    </form>
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <small style={{ color: 'var(--text-secondary)' }}>We will send a Magic Link to your email to Signup or Login.</small>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-secondary)' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                        <span style={{ padding: '0 1rem', fontSize: '0.875rem', fontWeight: '500' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                    </div>
                    <button
                        onClick={signInWithGoogle}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontWeight: 'bold'
                        }}
                    >
                        Sign in with Google
                    </button>
                </> : 
                <div className="flex items-center justify-center center gap-2">
                    <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={20} />
                    <small>Redirecting...</small>
                    </div>}
            </div>
        </div>
    );
}
