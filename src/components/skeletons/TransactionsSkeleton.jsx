export default function TransactionsSkeleton() {
    return (
        <div>
            <div className="flex items-center gap-2" style={{
                marginBottom: '2rem',
                height: '1.5rem',
                width: '150px'
            }}>
                <div className="skeleton-pulse" style={{
                    height: '1.5rem',
                    width: '150px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)'
                }} />
            </div>

            <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                <div className="skeleton-pulse" style={{
                    height: '2rem',
                    width: '180px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)'
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="skeleton-pulse" style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'var(--bg-secondary)'
                    }} />
                    <div className="skeleton-pulse" style={{
                        padding: '0.5rem 1rem',
                        width: '150px',
                        height: '2.5rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)'
                    }} />
                </div>
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
                <div className="skeleton-pulse" style={{
                    marginBottom: '1rem',
                    height: '0.875rem',
                    width: '250px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)'
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between" style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div className="flex items-center gap-4" style={{ flex: 1 }}>
                                <div className="skeleton-pulse" style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-primary)'
                                }} />
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton-pulse" style={{
                                        height: '0.875rem',
                                        width: '200px',
                                        background: 'var(--bg-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: '0.5rem'
                                    }} />
                                    <div className="skeleton-pulse" style={{
                                        height: '0.75rem',
                                        width: '150px',
                                        background: 'var(--bg-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: '0.5rem'
                                    }} />
                                    <div className="skeleton-pulse" style={{
                                        height: '0.75rem',
                                        width: '180px',
                                        background: 'var(--bg-primary)',
                                        borderRadius: 'var(--radius-md)'
                                    }} />
                                </div>
                            </div>
                            <div className="skeleton-pulse" style={{
                                height: '1.125rem',
                                width: '100px',
                                background: 'var(--bg-primary)',
                                borderRadius: 'var(--radius-md)',
                                marginLeft: '1rem'
                            }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
