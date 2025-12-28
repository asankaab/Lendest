import { Settings } from 'lucide-react';

export default function LoadingGear() {
    return (
        <div className="flex items-center justify-center w-full" style={{ minHeight: '85dvh' }}>
            <div style={{ position: 'relative' }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)',
                    opacity: '0.15',
                    filter: 'blur(15px)'
                }}></div>
                <Settings
                    size={80}
                    style={{
                        color: 'var(--accent-primary)',
                        animation: 'spin 3s linear infinite',
                        filter: 'drop-shadow(0 0 12px rgba(37, 99, 235, 0.4))'
                    }}
                />
            </div>
        </div>
    );
}
