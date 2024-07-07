import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';

import StatisticsLayout from 'src/layouts/statistics';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------
const StatisticsPage = lazy(() => import('src/pages/Statistics'));
// ----------------------------------------------------------------------

export const statisticsRoutes: RouteObject[] = [
  {
    path: 'statistics',
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <StatisticsLayout>
          <StatisticsPage />
        </StatisticsLayout>
      </Suspense>
    ),
  },
];
