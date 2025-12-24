import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useContext, useState } from 'react';
import { ThemeContext } from '../context/context';

export default function Sidebar() {
    const { signOut } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { theme, toggleTheme } = useContext(ThemeContext);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'People', path: '/people' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Mobile Menu Button - Hidden when sidebar is open */}
            {!isMobileMenuOpen && (
                <button
                    onClick={toggleMobileMenu}
                    style={{
                        position: 'fixed',
                        top: '1rem',
                        left: '1rem',
                        zIndex: 1001,
                        padding: '0.75rem',
                        aspectRatio: '1',
                        borderRadius: 'var(--radius)',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        display: 'none'
                    }}
                    className="mobile-menu-btn"
                >
                    <Menu size={24} />
                </button>
            )}

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    onClick={closeMobileMenu}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                        display: 'none'
                    }}
                    className="mobile-overlay"
                />
            )}

            <aside
                className={`glass ${isMobileMenuOpen ? 'mobile-open' : ''}`}
                style={{
                    width: 'var(--sidebar-width)',
                    height: '100dvh',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    left: 0,
                    top: 0
                }}
            >
                {/* Close button - only visible on mobile when sidebar is open */}
                <button
                    onClick={closeMobileMenu}
                    style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0',
                        padding: '0.5rem',
                        aspectRatio: '1 / 1',
                        borderRadius: 'var(--radius) 0 0 var(--radius)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        display: 'none',
                        zIndex: 10
                    }}
                    className="mobile-close-btn"
                >
                    <X size={20} />
                </button>

                <div style={{ marginBottom: '3rem', paddingLeft: '1rem', paddingTop: '0.25rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    LendBook
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={closeMobileMenu}
                            className={({ isActive }) =>
                                `flex items-center gap-4 ${isActive ? 'active' : ''}`
                            }
                            style={({ isActive }) => ({
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius)',
                                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                background: isActive ? 'var(--bg-secondary)' : 'transparent',
                                transition: 'all 0.2s'
                            })}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-4"
                        style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius)', color: 'var(--text-secondary)' }}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <button
                        onClick={signOut}
                        className="flex items-center gap-4"
                        style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius)', color: 'var(--danger)' }}
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-menu-btn {
                        display: block !important;
                    }
                    .mobile-overlay {
                        display: block !important;
                    }
                    aside.mobile-open .mobile-close-btn {
                        display: block !important;
                    }
                }
            `}</style>
        </>
    );
}
