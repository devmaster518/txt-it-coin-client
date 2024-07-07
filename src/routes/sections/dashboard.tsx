import { lazy, Suspense } from 'react';
import { Outlet, Navigate, RouteObject } from 'react-router-dom';

import { path } from 'src/routes/path';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
const UserListPage = lazy(() => import('src/pages/User/List'));
const UserCreatePage = lazy(() => import('src/pages/User/Create'));
const UserEditPage = lazy(() => import('src/pages/User/Edit'));

const AwardPage = lazy(() => import('src/pages/Award'));
const HistoryPage = lazy(() => import('src/pages/History'));

// ----------------------------------------------------------------------

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <Navigate to={path.dashboard.history.root} replace />, index: true },
      {
        path: 'users',
        children: [
          { index: true, element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          {
            path: ':id',
            children: [
              { index: true, element: <Navigate to="general" replace /> },
              {
                path: ':tab',
                element: <UserEditPage />,
              },
            ],
          },
        ],
      },
      {
        path: 'history',
        children: [{ index: true, element: <HistoryPage /> }],
      },
      {
        path: 'award',
        children: [{ index: true, element: <AwardPage /> }],
      },
    ],
  },
];
