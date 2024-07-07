import { Helmet } from 'react-helmet-async';

import LoginSection from 'src/sections/Login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Login</title>
      </Helmet>

      <LoginSection />
    </>
  );
}
