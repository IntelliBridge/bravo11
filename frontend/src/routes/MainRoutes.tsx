import { lazy } from 'react';

// project imports
import MainLayout from 'components/common/layout/MainLayout';
import Loadable from 'components/ui/Loadable';
// import AuthGuard from 'utils/route-guard/AuthGuard';

// // dashboard routing
// const DashboardAnalytics = Loadable(lazy(() => import('components/views/dashboard/Analytics')));
//
// application routing
const AppChat = Loadable(lazy(() => import('components/views/application/chat')));

// Map
const Map = Loadable(lazy(() => import('components/views/map/Map')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        // <AuthGuard>
            <MainLayout />
        // </AuthGuard>
    ),
    children: [
        {
            path: '/map',
            element: <Map />
        },
        {
            path: '/chat',
            element: <AppChat />
        },
        {
            path: '',
            element: <>Dashboard</>
        }
    ]
};

export default MainRoutes;
