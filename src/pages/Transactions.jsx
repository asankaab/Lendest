import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/currencyFormatter';
import TransactionsSkeleton from '../components/TransactionsSkeleton';

export default function Transactions() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, lend, borrow, repayment, paid_back

    const currency = 'usd';

    // useEffect(() => {
    //     const fetchTransactions = async () => {
    //         try {
    //             const data = await api.getTransactions();
    //             setTransactions(data);
    //         } catch (error) {
    //             console.error('Error fetching transactions:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     if (user) fetchTransactions();
    // }, [user]);

    const filteredTransactions = filter === 'all'
        ? transactions
        : transactions.filter(tx => tx.type === filter);

    if (loading) return <TransactionsSkeleton />;

    return (
        <div>
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
                style={{
                    marginBottom: '2rem',
                    color: 'var(--text-secondary)',
                    fontWeight: '500'
                }}
            >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>All Transactions</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Filter size={20} style={{ color: 'var(--text-secondary)' }} />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            fontWeight: '500'
                        }}
                    >
                        <option value="all">All Types</option>
                        <option value="lend">Lent</option>
                        <option value="borrow">Borrowed</option>
                        <option value="repayment">Got Paid</option>
                        <option value="paid_back">I Paid Back</option>
                    </select>
                </div>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    Showing {filteredTransactions.length} of {transactions.length} transactions
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredTransactions.map((tx) => (
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
                                    background: tx.type === 'lend' ? 'rgba(16, 185, 129, 0.1)' :
                                        (tx.type === 'repayment' ? 'rgba(245, 158, 11, 0.1)' :
                                            (tx.type === 'paid_back' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)')),
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
                                        {tx.type === 'lend' && <span style={{ textTransform: 'capitalize' }}>Lent to {tx.person_name}</span>}
                                        {tx.type === 'borrow' && <span style={{ textTransform: 'capitalize' }}>Borrowed from {tx.person_name}</span>}
                                        {tx.type === 'repayment' && <span style={{ textTransform: 'capitalize' }}>Paid by {tx.person_name}</span>}
                                        {tx.type === 'paid_back' && <span style={{ textTransform: 'capitalize' }}>Paid back to {tx.person_name}</span>}
                                    </div>
                                    {tx.description && (
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                            {tx.description}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                        {new Date(tx.created_at).toLocaleDateString()} - {new Date(tx.created_at).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                fontWeight: 'bold',
                                fontSize: '1.125rem',
                                color: tx.type === 'lend' ? 'var(--success)' :
                                    (tx.type === 'repayment' ? 'var(--warning)' :
                                        (tx.type === 'paid_back' ? 'var(--danger)' : 'var(--danger)'))
                            }}>
                                <small>{tx.type === 'lend' ? '+' : '-'}</small>{formatCurrency(tx.amount, currency)}
                            </div>
                        </div>
                    ))}
                    {filteredTransactions.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                            No transactions found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
