import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Passkeys() {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <button
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2"
                style={{
                    marginBottom: '2rem',
                    color: 'var(--text-secondary)',
                    fontWeight: '500'
                }}
            >
                <ArrowLeft size={20} />
                <span>Back to Settings</span>
            </button>

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Passkeys</h1>

            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>

            </div>
        </div>
    );
}