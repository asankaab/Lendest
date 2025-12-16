
import { useEffect, useState } from 'react';
import { UserPlus, Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import AddTransactionModal from '../components/AddTransactionModal';
import AddPersonModal from '../components/AddPersonModal';

export default function People() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch all people and transactions
    const fetchPeople = async () => {
        try {
            const [allPeople, transactions] = await Promise.all([
                api.getPeople(),
                api.getTransactions()
            ]);

            // Initialize map with all people
            const peopleMap = {};

            // 1. Add all existing people to the map
            allPeople.forEach(person => {
                peopleMap[person.username] = {
                    id: person.username,
                    name: person.name,
                    username: person.username,
                    balance: 0,
                };
            });

            // 2. Process transactions to calculate balances
            transactions.forEach(tx => {
                const name = tx.person_name;
                const username = tx.person_username || name.toLowerCase().replace(/\s+/g, '_');

                // Ensure person exists in map (legacy/fallback if not in people table)
                if (!peopleMap[username]) {
                    peopleMap[username] = {
                        id: username,
                        name: name,
                        username: username,
                        balance: 0,
                    };
                }

                const amount = parseFloat(tx.amount);
                if (tx.type === 'lend') {
                    peopleMap[username].balance += amount;
                } else {
                    peopleMap[username].balance -= amount;
                }
            });

            setPeople(Object.values(peopleMap));
        } catch (error) {
            console.error('Error fetching people:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchPeople();
    }, [user]);

    const handleCreateTransaction = async (formData) => {
        await api.createTransaction(user.id, formData);
        await fetchPeople(); // Refresh list to show new person
    };

    const handleCreatePerson = async ({ name, username }) => {
        await api.createPerson(user.id, { name, username });
        await fetchPeople();
    };

    if (loading) return <div className="p-8">Loading...</div>;

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
                                {person.balance > 0 ? `+ $${person.balance.toFixed(2)}` : (person.balance < 0 ? `- $${Math.abs(person.balance).toFixed(2)}` : '$0.00')}
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
