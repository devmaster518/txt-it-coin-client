import Container from '@mui/material/Container';

import { path } from 'src/routes/path';

import BreadCrumbs from 'src/components/Breadcrumbs';
import { useSettingsContext } from 'src/components/settings';

import UserCreateForm from './UserCreateForm';

// ----------------------------------------------------------------------

export default function UserCreateView() {
  const settings = useSettingsContext();

  return (
    // TODO: Consider moving this Container to dashboard route definition as every page will have same layout
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <BreadCrumbs
        heading="Create a new user"
        links={[
          {
            name: 'User',
            href: path.dashboard.user.root,
          },
          { name: 'New user' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserCreateForm />
    </Container>
  );
}
