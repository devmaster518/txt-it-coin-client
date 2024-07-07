import { Helmet } from 'react-helmet-async';
import { useLazyQuery } from '@apollo/client';
import { Navigate, useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { path } from 'src/routes/path';
import { useRouter } from 'src/routes/hooks';

import { gql } from 'src/__generated__/gql';

import Iconify from 'src/components/iconify';
import BreadCrumbs from 'src/components/Breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="hugeicons:profile" width={24} />,
  },
  {
    value: 'organizations',
    label: 'Organizations',
    icon: <Iconify icon="tabler:binary-tree" width={24} />,
  },
];

// ----------------------------------------------------------------------
const FETCH_USER = gql(/* GraphQL */ `
  query FetchUser($filter: JSONObject) {
    users(filter: $filter) {
      users {
        id
        username
        email
        isAdmin
      }
    }
  }
`);

// ----------------------------------------------------------------------
export default function OrganizationEditView() {
  // Loading state including first initial render
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const settings = useSettingsContext();

  const [fetchUserGraphql, { loading, data, called }] = useLazyQuery(FETCH_USER);

  const { id: userId, tab: tabParam } = params;

  const fetchUser = useCallback(() => {
    fetchUserGraphql({ variables: { filter: { id: userId } } });
  }, [fetchUserGraphql, userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    setIsLoading(!called || loading);
  }, [loading, called]);

  const user = data?.users?.users?.[0];

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to={path.notFound} replace />;
  }

  return (
    <>
      <Helmet>
        <title>{`Texitcoin: ${user.username}`}</title>
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <BreadCrumbs
          heading={user.username}
          links={[{ name: 'User', href: path.dashboard.user.root }, { name: user.username }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Tabs
          value={tabParam || 'general'}
          onChange={(_, newTab) => {
            router.push(`../${newTab}`);
          }}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={<>{tab.label}</>} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {/* {tabParam === 'general' && <UserGeneral currentUser={user} />} */}
      </Container>
    </>
  );
}
