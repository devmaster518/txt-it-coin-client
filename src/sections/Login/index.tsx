import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useQuery, useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/useBoolean';

import { gql } from 'src/__generated__/gql';
import { PATH_AFTER_LOGIN } from 'src/config';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

const LOGIN_MUTATION = gql(/* GraphQL */ `
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      accessToken
    }
  }
`);

// ----------------------------------------------------------------------
const LoginSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  password: Yup.string().required('Password is required'),
});
// ----------------------------------------------------------------------

export default function LoginSection() {
  const { fetchMe } = useAuthContext();

  const router = useRouter();

  const [{ returnTo }] = useQuery();

  const isPasswordShown = useBoolean();

  // TODO: Remove this on production
  const defaultValues = {
    email: 'vitovodenko@gmail.com',
    password: '123456789',
  };

  const form = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const [submitLogin, { error }] = useMutation(LOGIN_MUTATION);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await submitLogin({ variables: { data } });
      fetchMe(response.data?.login.accessToken);
      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (err) {
      reset();
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in to Texitcoin Admin</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="email" label="Email address" />

      <RHFTextField
        name="password"
        label="Password"
        type={isPasswordShown.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={isPasswordShown.onToggle} edge="end">
                <Iconify
                  icon={isPasswordShown.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      <Alert severity="info" sx={{ mb: 3 }}>
        Use email : <strong>{defaultValues.email}</strong> / password :{' '}
        <strong>{defaultValues.password}</strong>
      </Alert>

      {!!error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      )}

      <FormProvider form={form} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}
