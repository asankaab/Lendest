
import { useState } from 'react';
import { UserPlus, Search, Plus } from 'lucide-react';
import { useNavigate, useLoaderData, useRevalidator } from 'react-router-dom';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/currencyFormatter';
import AddTransactionModal from '../components/AddTransactionModal';
import AddPersonModal from '../components/AddPersonModal';
import { useAuth } from '../hooks/useAuth';

export default function People() {
    const { user, currency } = useAuth();
    const navigate = useNavigate();
    const people = useLoaderData();
    const { revalidate } = useRevalidator();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleCreateTransaction = async (formData) => {
        await api.createTransaction(user.id, formData);
        revalidate(); // Refresh list to show updated balances
    };

    const handleCreatePerson = async ({ name, username }) => {
        await api.createPerson(user.id, { name, username });
        revalidate();
    };

    return (
        <div>
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTransaction}
            />

            <AddPersonModal
                isOpen={isPersonModalOpen}
                onClose={() => setIsPersonModalOpen(false)}
                onSubmit={handleCreatePerson}
            />

            <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>People</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsPersonModalOpen(true)}
                        className="flex items-center gap-2"
                        style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontWeight: 'bold',
                            border: '1px solid var(--border-color)'
                        }}
                    >
                        <UserPlus size={20} />
                        <span className="mobile-button-text">New Person</span>
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2"
                        style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--accent-primary)',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        <Plus size={20} />
                        <span className="mobile-button-text">New Transaction</span>
                    </button>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-button-text {
                        display: none;
                    }
                }
            `}</style>

            <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
                <div className="flex items-center gap-4" style={{
                    background: 'var(--bg-primary)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                }}>
                    <Search size={20} style={{ color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search people..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--text-primary)',
                            width: '100%',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {people
                    .filter((person) => {
                        const searchLower = searchQuery.toLowerCase();
                        return person.name.toLowerCase().includes(searchLower) || person.username.toLowerCase().includes(searchLower);
                    })
                    .map((person) => (
                        <div
                            key={person.id}
                            className="glass"
                            style={{ padding: '1.5rem', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                            onClick={() => navigate(`/people/${encodeURIComponent(person.username)}`)}
                        >
                            <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: 'var(--accent-secondary)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.25rem'
                                }}>
                                    {person.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.125rem', textTransform: 'capitalize' }}>{person.name}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>@{person.username}</div>
                                </div>
                            </div>

                            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Net Balance</span>
                                <span style={{
                                    fontWeight: 'bold',
                                    color: person.balance > 0 ? 'var(--success)' : (person.balance < 0 ? 'var(--danger)' : 'var(--text-secondary)')
                                }}>
                                    {person.balance > 0 ? `+ ${formatCurrency(person.balance, currency)}` : (person.balance < 0 ? `- ${formatCurrency(Math.abs(person.balance), currency)}` : formatCurrency(0, currency))}
                                </span>
                            </div>
                        </div>
                    ))}
                {people.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No people found. Add transactions to see people here.
                    </div>
                )}
            </div>
        </div>
    );
}
