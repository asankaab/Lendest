import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { currencyValues } from '../lib/currencyFormatter';
import { api } from '../lib/api';

export default function CurrencySettings() {
    const { user, currency, setCurrency } = useAuth();
    const navigate = useNavigate();

    const currencies = currencyValues;

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

            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Currency Settings</h1>

            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Select your preferred currency. This will be displayed throughout the app.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                    {currencies.map((curr) => (
                        <button
                            key={curr.code}
                            onClick={async() => 
                                {
                                    const update = await api.updateCurrency(user.id, curr.code.toLowerCase());
                                    setCurrency(update.currency.toUpperCase());
                                }
                            }
                            style={{
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid',
                                borderColor: currency === curr.code ? 'var(--accent-primary)' : 'var(--border-color)',
                                background: currency === curr.code ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontWeight: currency === curr.code ? '600' : '500'
                            }}
                        >
                            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{curr.symbol}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{curr.code}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.2' }}>
                                {curr.name}
                            </div>
                        </button>
                    ))}
                </div>

                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem'
                }}>
                    <strong>Note:</strong> Changing the currency only affects how amounts are displayed in the app. It does not convert existing transaction values.
                </div>
            </div>
        </div>
    );
}
