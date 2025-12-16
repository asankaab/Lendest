import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div className="flex">
            <Sidebar />
            <main style={{
                marginLeft: 'var(--sidebar-width)',
                flex: 1,
                minHeight: '100vh',
                padding: '2rem',
                maxWidth: '100%',
                overflowX: 'hidden'
            }}>
                <div className="container">
                    <Outlet />
                </div>
            </main>

            <style>{`
                @media (max-width: 768px) {
                    main {
                        margin-left: 0 !important;
                        padding: 5rem 1rem 1rem 1rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
