export default function DashboardSkeleton() {
    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                <div style={{
                    height: '2rem',
                    width: '150px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }} />
                <div style={{
                    height: '2.5rem',
                    width: '180px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }} />
            </div>

            {/* Stats Cards Skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                            <div style={{
                                height: '1rem',
                                width: '100px',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }} />
                            <div style={{
                                height: '1.5rem',
                                width: '1.5rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: '50%',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }} />
                        </div>
                        <div style={{
                            height: '2rem',
                            width: '120px',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '0.5rem',
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }} />
                        <div style={{
                            height: '0.875rem',
                            width: '150px',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }} />
                    </div>
                ))}
            </div>

            {/* Chart Skeleton */}
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
                <div style={{
                    height: '1.25rem',
                    width: '150px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }} />
                <div style={{
                    height: '300px',
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }} />
            </div>

            {/* Recent Transactions Skeleton */}
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                        height: '1.25rem',
                        width: '180px',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }} />
                    <div style={{
                        height: '0.875rem',
                        width: '80px',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div className="flex items-center gap-4" style={{ flex: 1 }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-primary)',
                                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        height: '0.875rem',
                                        width: '150px',
                                        background: 'var(--bg-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: '0.5rem',
                                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                    }} />
                                    <div style={{
                                        height: '0.75rem',
                                        width: '100px',
                                        background: 'var(--bg-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                    }} />
                                </div>
                            </div>
                            <div style={{
                                height: '0.875rem',
                                width: '80px',
                                background: 'var(--bg-primary)',
                                borderRadius: 'var(--radius-md)',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }} />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            `}</style>
        </div>
    );
}
