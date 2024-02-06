import { lazy } from 'react';

// project imports
import GuestGuard from 'utils/route-guard/GuestGuard';
import MinimalLayout from 'components/common/layout/MinimalLayout';
import NavMotion from 'components/common/layout/NavMotion';
import Loadable from 'components/ui/Loadable';

// login routing
const AuthLogin = Loadable(lazy(() => import('components/views/pages/authentication/authentication3/Login3')));
const AuthRegister = Loadable(lazy(() => import('components/views/pages/authentication/authentication3/Register3')));
const AuthForgotPassword = Loadable(lazy(() => import('components/views/pages/authentication/authentication3/ForgotPassword3')));
const AuthResetPassword = Loadable(lazy(() => import('components/views/pages/authentication/authentication3/ResetPassword3')));
const AuthCheckMail = Loadable(lazy(() => import('components/views/pages/authentication/authentication3/CheckMail3')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <GuestGuard>
                <MinimalLayout />
            </GuestGuard>
        </NavMotion>
    ),
    children: [
        {
            path: '/login',
            element: <AuthLogin />
        },
        {
            path: '/register',
            element: <AuthRegister />
        },
        {
            path: '/forgot',
            element: <AuthForgotPassword />
        },
        {
            path: '/reset-password',
            element: <AuthResetPassword />
        },
        {
            path: '/check-mail',
            element: <AuthCheckMail />
        }
    ]
};

export default LoginRoutes;
