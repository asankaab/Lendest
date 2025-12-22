
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Plus, Trash2, Settings, MoreHorizontal } from 'lucide-react';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/currencyFormatter';
import AddTransactionModal from '../components/AddTransactionModal';
import ConfirmationModal from '../components/ConfirmationModal';
import RenameModal from '../components/RenameModal';
import PersonDetailsSkeleton from '../components/PersonDetailsSkeleton';

export default function PersonDetails() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [personName, setPersonName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Confirmation Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeletePersonModalOpen, setIsDeletePersonModalOpen] = useState(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const fetchDetails = async () => {
        try {
            const user_id = decodeURIComponent(username);
            const txs = await api.getTransactionsByPerson(user_id);
            setTransactions(txs);

            // Set display name from first transaction or username
            if (txs.length > 0) {
                setPersonName(txs[0].person_name);
            } else {
                setPersonName(user_id); // Fallback, though we might want to fetch person details if txs empty
            }

            // Calculate balance
            const total = txs.reduce((acc, tx) => {
                const amount = parseFloat(tx.amount);
                if (tx.type === 'lend') return acc + amount;
                if (tx.type === 'borrow') return acc - amount;
                if (tx.type === 'repayment') return acc - amount; // Repayment (received) reduces the positive balance (debt to me)
                if (tx.type === 'paid_back') return acc + amount; // Paid back (I paid) increases the positive balance (reduces debt I owe)
                return acc;
            }, 0);
            setBalance(total);
        } catch (error) {
            console.error('Error fetching person details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (username) fetchDetails();
    }, [username]);

    const handleCreateTransaction = async (formData) => {
        await api.createTransaction(user.id, formData);
        await fetchDetails();
    };

    const confirmDelete = (id) => {
        setTransactionToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteTransaction = async () => {
        if (transactionToDelete) {
            try {
                await api.deleteTransaction(transactionToDelete);
                await fetchDetails();
            } catch (error) {
                console.error('Error deleting transaction:', error);
                // Ideally this would also use a custom alert or toast, but native alert fallback for error is okay for now
                alert('Failed to delete transaction');
            }
        }
    };

    const confirmDeletePerson = () => {
        setIsDeletePersonModalOpen(true);
    };

    const handleDeletePerson = async () => {
        try {
            const user_id = decodeURIComponent(username);
            await api.deletePerson(user_id);
            navigate('/people'); // Redirect to people list
        } catch (error) {
            console.error('Error deleting person:', error);
            alert('Failed to delete person');
        }
    };

    const handleRenamePerson = async (newName) => {
        try {
            const user_id = decodeURIComponent(username);
            await api.updatePersonName(user_id, newName);
            setPersonName(newName);
            // Refresh details to ensure consistent state
            await fetchDetails();
        } catch (error) {
            console.error('Error renaming person:', error);
            alert('Failed to rename person');
        }
    };

    if (loading) return <PersonDetailsSkeleton />;

    return (
        <div>
            <button
                onClick={() => navigate('/people')}
                className="flex items-center gap-2"
                style={{
                    marginBottom: '2rem',
                    color: 'var(--text-secondary)',
                    fontWeight: '500'
                }}
            >
                <ArrowLeft size={20} />
                <span>Back to People</span>
            </button>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTransaction}
                initialPersonName={personName}
                initialUsername={username}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteTransaction}
                title="Delete Transaction"
                message="Are you sure you want to delete this transaction? This action cannot be undone."
            />

            <ConfirmationModal
                isOpen={isDeletePersonModalOpen}
                onClose={() => setIsDeletePersonModalOpen(false)}
                onConfirm={handleDeletePerson}
                title="Delete Person"
                message={`Are you sure you want to delete ${personName} and all their transactions? This action cannot be undone.`}
            />

            <RenameModal
                isOpen={isRenameModalOpen}
                onClose={() => setIsRenameModalOpen(false)}
                onSubmit={handleRenamePerson}
                currentName={personName}
            />

            <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'capitalize' }}>{personName}</h1>
                    <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>@{username}</div>
                    <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
                        Net Balance: <span style={{
                            color: balance > 0 ? 'var(--success)' : (balance < 0 ? 'var(--danger)' : 'var(--text-primary)'),
                            fontWeight: 'bold'
                        }}>
                            {balance > 0 ? `+ ${formatCurrency(balance, currency)}` : (balance < 0 ? `- ${formatCurrency(Math.abs(balance), currency)}` : formatCurrency(0, currency))}
                        </span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                        <span className="mobile-button-text">Add Transaction</span>
                    </button>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-secondary)',
                                border: '1px solid var(--border-color)',
                                cursor: 'pointer'
                            }}
                        >
                            <Settings size={20} />
                        </button>

                        {isMenuOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '0.5rem',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius)',
                                boxShadow: 'var(--shadow-md)',
                                zIndex: 50,
                                minWidth: '200px',
                                overflow: 'hidden'
                            }}>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setIsRenameModalOpen(true);
                                    }}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '0.75rem 1rem',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.875rem',
                                        fontWeight: '500'
                                    }}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    Rename Person
                                </button>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        confirmDeletePerson();
                                    }}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        padding: '0.75rem 1rem',
                                        color: 'var(--danger)',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        borderTop: '1px solid var(--border-color)'
                                    }}
                                    className="hover:bg-red-50 dark:hover:bg-red-900/10"
                                >
                                    Delete Person
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-button-text {
                        display: none;
                    }
                }
            `}</style>

            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Transaction History</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between" style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div className="flex items-center gap-4">
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    aspectRatio: '1',
                                    borderRadius: '50%',
                                    background: tx.type === 'lend' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {tx.type === 'lend' && <ArrowUpRight size={20} color="var(--success)" />}
                                    {tx.type === 'borrow' && <ArrowDownRight size={20} color="var(--danger)" />}
                                    {tx.type === 'repayment' && <ArrowDownRight size={20} color="var(--warning)" />}
                                    {tx.type === 'paid_back' && <ArrowUpRight size={20} color="var(--danger)" />}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>
                                        {tx.description || (
                                            tx.type === 'lend' ? 'Lent money' :
                                                (tx.type === 'repayment' ? 'Paid back' :
                                                    (tx.type === 'paid_back' ? 'I paid back' : 'Borrowed money'))
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {new Date(tx.created_at).toLocaleDateString()} - {new Date(tx.created_at).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div style={{
                                    fontWeight: 'bold',
                                    color: tx.type === 'lend' ? 'var(--success)' :
                                        (tx.type === 'repayment' ? 'var(--warning)' :
                                            (tx.type === 'paid_back' ? 'var(--danger)' : 'var(--danger)'))
                                }}>
                                    <small>{tx.type === 'lend' ? '+' : '-'}</small>{formatCurrency(tx.amount, currency)}
                                </div>
                                <button
                                    onClick={() => confirmDelete(tx.id)}
                                    style={{
                                        padding: '0.5rem',
                                        color: 'var(--text-secondary)',
                                        borderRadius: 'var(--radius)',
                                        transition: 'color 0.2s',
                                    }}
                                    className="hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    title="Delete Transaction"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                            No transactions found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
