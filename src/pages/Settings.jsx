
import { User, Bell, Shield, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const navigate = useNavigate();
    const sections = [
        {
            title: 'Profile',
            icon: User,
            items: [
                { label: 'Personal Information', path: '/settings/personal-information' },
                { label: 'Avatar', path: null },
                { label: 'Email Settings', path: null }
            ]
        },
        {
            title: 'Notifications',
            icon: Bell,
            items: [
                { label: 'Email Notifications', path: null },
                { label: 'Push Notifications', path: null },
                { label: 'Reminders', path: null }
            ]
        },
        {
            title: 'Security',
            icon: Shield,
            items: [
                { label: 'Passkeys', path: '/settings/passkeys' },
                { label: 'Two-Factor Authentication', path: null },
                { label: 'Connected Devices', path: null }
            ]
        },
        {
            title: 'Financial',
            icon: Wallet,
            items: [
                { label: 'Currency', path: '/settings/currency' },
                { label: 'Default Payment Method', path: null },
                { label: 'Export Data', path: null }
            ]
        }
    ];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 'bold' }}>Settings</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {sections.map((section) => (
                    <div key={section.title} className="glass" style={{ padding: '0', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                        <div style={{
                            padding: '1rem 1.5rem',
                            borderBottom: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <section.icon size={20} />
                            <span>{section.title}</span>
                        </div>
                        <div>
                            {section.items.map((item, index) => (
                                <div key={item.label} style={{
                                    padding: '1rem 1.5rem',
                                    borderBottom: index !== section.items.length - 1 ? '1px solid var(--border-color)' : 'none',
                                    cursor: item.path ? 'pointer' : 'default',
                                    transition: 'background 0.2s',
                                    opacity: item.path ? 1 : 0.6
                                }}
                                    className={item.path ? "hover:bg-opacity-50" : ""}
                                    onMouseEnter={(e) => item.path && (e.currentTarget.style.background = 'var(--bg-secondary)')}
                                    onMouseLeave={(e) => item.path && (e.currentTarget.style.background = 'transparent')}
                                    onClick={() => item.path && navigate(item.path)}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
