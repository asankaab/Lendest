import { useState, memo, useCallback, Suspense, lazy } from 'react';
import { useLoaderData, useRevalidator, NavLink } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, DollarSign, Plus } from 'lucide-react';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/currencyFormatter';
import { useAuth } from '../hooks/useAuth';

// Lazy load Recharts - only when Dashboard is visited
const DashboardChart = lazy(() => import('../components/DashboardChart'));

// Lazy load modal - only when user clicks button
const AddTransactionModal = lazy(() => import('../components/AddTransactionModal'));

// Memoized stat card component
const StatCard = memo(({ title, value, icon: Icon, color, subtitle }) => (
    <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{title}</span>
            <Icon size={20} style={{ color }} />
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {value}
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {subtitle}
        </div>
    </div>
));

StatCard.displayName = 'StatCard';

// Memoized transaction item component
const TransactionItem = memo(({ tx, currency }) => (
    <div className="flex items-center justify-between" style={{
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
));

TransactionItem.displayName = 'TransactionItem';

function Dashboard() {
    const { user, currency } = useAuth();
    const { transactions, stats, chartData } = useLoaderData();
    const { revalidate } = useRevalidator();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateTransaction = useCallback(async (formData) => {
        await api.createTransaction(user.id, formData);
        revalidate(); // Refresh data
    }, [user.id, revalidate]);

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleOpenModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    return (
        <div>
            {isModalOpen && (
                <Suspense fallback={null}>
                    <AddTransactionModal
                        isOpen={isModalOpen}
                        onClose={handleModalClose}
                        onSubmit={handleCreateTransaction}
                    />
                </Suspense>
            )}

            <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
                <button
                    onClick={handleOpenModal}
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
                <StatCard 
                    title="Net Balance"
                    value={formatCurrency(stats.net, currency)}
                    icon={DollarSign}
                    color="var(--accent-primary)"
                    subtitle="Based on all time"
                />
                <StatCard 
                    title="Owed to You"
                    value={formatCurrency(stats.owedToYou, currency)}
                    icon={ArrowUpRight}
                    color="var(--success)"
                    subtitle="From people"
                />
                <StatCard 
                    title="You Owe"
                    value={formatCurrency(stats.youOwe, currency)}
                    icon={ArrowDownRight}
                    color="var(--danger)"
                    subtitle="To people"
                />
            </div>

            {/* Charts Section - Lazy loaded */}
            <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading chart...</div>}>
                <DashboardChart data={chartData} />
            </Suspense>

            {/* Recent Transactions */}
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Recent Transactions</h2>
                    <NavLink
                        to='/transactions'
                        style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                        View All
                    </NavLink>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {transactions.map((tx) => (
                        <TransactionItem key={tx.id} tx={tx} currency={currency} />
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

export default memo(Dashboard);
