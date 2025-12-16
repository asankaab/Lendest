export default function PeopleSkeleton() {
    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                <div style={{
                    height: '2rem',
                    width: '120px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }} />
                <div className="flex gap-4">
                    <div style={{
                        height: '2.5rem',
                        width: '130px',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }} />
                    <div style={{
                        height: '2.5rem',
                        width: '150px',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }} />
                </div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '2rem' }}>
                <div className="flex items-center gap-4" style={{
                    background: 'var(--bg-primary)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{
                        width: '20px',
                        height: '20px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '50%',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }} />
                    <div style={{
                        flex: 1,
                        height: '1.25rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }} />
                </div>
            </div>

            {/* People Grid Skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)' }}>
                        <div className="flex items-center gap-4" style={{ marginBottom: '1rem' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'var(--bg-secondary)',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }} />
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    height: '1.125rem',
                                    width: '140px',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '0.5rem',
                                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                }} />
                                <div style={{
                                    height: '0.875rem',
                                    width: '100px',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-md)',
                                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                                }} />
                            </div>
                        </div>

                        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{
                                height: '0.875rem',
                                width: '100px',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }} />
                            <div style={{
                                height: '1rem',
                                width: '120px',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                            }} />
                        </div>
                    </div>
                ))}
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
