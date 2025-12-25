import { useState } from 'react';
import { useNavigate, useLoaderData, useRevalidator } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Plus } from 'lucide-react';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/currencyFormatter';
import AddTransactionModal from '../components/AddTransactionModal';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, currency } = useAuth();
    const { transactions, stats, chartData } = useLoaderData();
    const { revalidate } = useRevalidator();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateTransaction = async (formData) => {
        await api.createTransaction(user.id, formData);
        revalidate(); // Refresh data
    };

    return (
        <div>
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTransaction}
            />

            <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
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
                    <span>New Transaction</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Net Balance</span>
                        <DollarSign size={20} style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {formatCurrency(stats.net, currency)}
                    </div>
                    <div className="flex items-center gap-4" style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--success)' }}>
                        <ArrowUpRight size={16} />
                        <span>Based on all time</span>
                    </div>
                </div>

                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Owed to You</span>
                        <ArrowUpRight size={20} style={{ color: 'var(--success)' }} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {formatCurrency(stats.owedToYou, currency)}
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        From people
                    </div>
                </div>

                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>You Owe</span>
                        <ArrowDownRight size={20} style={{ color: 'var(--danger)' }} />
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {formatCurrency(stats.youOwe, currency)}
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        To people
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Financial Trend</h2>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData} style={{ minWidth: '300px', minHeight: '100px' }}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--bg-card)',
                                    borderColor: 'var(--border-color)',
                                    borderRadius: 'var(--radius)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                            <Area type="monotone" dataKey="amount" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorAmount)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Recent Transactions</h2>
                    <button
                        onClick={() => navigate('/transactions')}
                        style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                        View All
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {transactions.slice(0, 5).map((tx) => (
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
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                fontWeight: 'bold',
                                color: tx.type === 'lend' ? 'var(--success)' :
                                    (tx.type === 'repayment' ? 'var(--warning)' :
                                        (tx.type === 'paid_back' ? 'var(--danger)' : 'var(--danger)'))
                            }}>
                                {tx.type === 'lend' ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                            No transactions yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
