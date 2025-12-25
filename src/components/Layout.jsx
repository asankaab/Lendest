import { Outlet, useNavigation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardSkeleton from './skeletons/DashboardSkeleton';
import PeopleSkeleton from './skeletons/PeopleSkeleton';
import PersonDetailsSkeleton from './skeletons/PersonDetailsSkeleton';
import TransactionsSkeleton from './skeletons/TransactionsSkeleton';

export default function Layout() {
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';

    let SkeletonComponent = null;
    if (isLoading) {
        if (navigation.location.pathname === '/') {
            SkeletonComponent = DashboardSkeleton;
        } else if (navigation.location.pathname === '/people') {
            SkeletonComponent = PeopleSkeleton;
        } else if (navigation.location.pathname === '/transactions') {
            SkeletonComponent = TransactionsSkeleton;
        } else if (navigation.location.pathname.startsWith('/people/')) {
            SkeletonComponent = PersonDetailsSkeleton;
        }
    }

    return (
        <div className="flex">
            <Sidebar />
            <main className='main' style={{
                marginLeft: 'var(--sidebar-width)',
                flex: 1,
                minHeight: '100vh',
                padding: '2rem',
                maxWidth: '100%',
                overflowX: 'hidden'
            }}>
                <div className="container">
                    {SkeletonComponent ? <SkeletonComponent /> : <Outlet />}
                </div>
            </main>
        </div>
    );
}
