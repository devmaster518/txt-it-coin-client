import { Helmet } from 'react-helmet-async';

import Award from 'src/sections/Award';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Texitcoin Award</title>
      </Helmet>

      <Award />
    </>
  );
}
