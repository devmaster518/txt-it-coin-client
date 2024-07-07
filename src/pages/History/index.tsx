import { Helmet } from 'react-helmet-async';

import History from 'src/sections/History';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Texitcoin History</title>
      </Helmet>

      <History />
    </>
  );
}
