import { useLazyQuery } from '@apollo/client';
import { useMemo, useEffect, useCallback } from 'react';

import { gql } from 'src/__generated__/gql';
import { STORAGE_TOKEN_KEY } from 'src/consts';

import { AuthContext } from './AuthContext';
import { setToken, isValidToken, setTokenTimer } from './utils';

const FETCH_ME_QUERY = gql(/* GraphQL */ `
  query FetchMe {
    me {
      id
      username
      email
    }
  }
`);

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);

  const [fetchMe, { loading, error, data }] = useLazyQuery(FETCH_ME_QUERY);

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (token && isValidToken(token)) {
      fetchMe();
      timerId = setTokenTimer(token);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [token, fetchMe]);

  useEffect(() => {
    if (error) {
      // TODO: Show alert token is invalid
      setToken(null);
    }
  }, [error]);

  // LOGOUT ACTION
  const logout = useCallback(() => {
    setToken(null);
  }, []);

  // ----------------------------------------------------------------------

  const memoizedValue = useMemo(
    () => ({
      isAuthenticated: !!token,
      user: data?.me,
      loading,
      fetchMe: (newToken?: string) => {
        if (newToken) {
          setToken(newToken);
        }
        fetchMe();
      },
      logout,
    }),
    [fetchMe, logout, loading, data, token]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
