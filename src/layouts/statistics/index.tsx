import Box from '@mui/material/Box';

import { useBoolean } from 'src/hooks/useBoolean';

import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const nav = useBoolean();

  return (
    <>
      <Header onOpenNav={nav.onFalse} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Main>{children}</Main>
      </Box>
    </>
  );
}
