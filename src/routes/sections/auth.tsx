import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';

import { GuestGuard } from 'src/auth/guard';
import AuthClassicLayout from 'src/layouts/auth/classic';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
const LoginPage = lazy(() => import('src/pages/Login'));
// ----------------------------------------------------------------------

export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <GuestGuard>
          <AuthClassicLayout>
            <LoginPage />
          </AuthClassicLayout>
        </GuestGuard>
      </Suspense>
    ),
  },
];
