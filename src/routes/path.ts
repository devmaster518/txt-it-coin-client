// ----------------------------------------------------------------------

const ROOTS = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  STATISTICS: '/statistics',
};

// ----------------------------------------------------------------------

export const path = {
  // AUTH
  login: ROOTS.LOGIN,

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    history: {
      root: `${ROOTS.DASHBOARD}/history`,
    },
    award: {
      root: `${ROOTS.DASHBOARD}/award`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/users`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/users/${id}`,
      new: `${ROOTS.DASHBOARD}/users/new`,
    },
  },

  // STATISTICS
  statistics: {
    root: ROOTS.STATISTICS,
  },

  notFound: '/404',
};
