import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApolloError, useMutation } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { path } from 'src/routes/path';
import { useRouter } from 'src/routes/hooks';

import { gql } from 'src/__generated__/gql';

import { useSnackbar } from 'src/components/SnackBar';
import FormProvider, { RHFSwitch, RHFTextField, RHFSelectAvatar } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const CREATE_USER = gql(/* GraphQL */ `
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      username
      email
      isAdmin
      createdAt
    }
  }
`);

// ----------------------------------------------------------------------

const NewUserSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  fullname: Yup.string().required('Fullname is required'),
  sponsorName: Yup.string().required('SponsorName is required'),
  introducerFullName: Yup.string().required('IntroducerFullName is required'),
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  password: Yup.string().required('Password is required'),
  mobile: Yup.string().required('Mobile number is required'),
  assetId: Yup.string().required('AssetId is required'),
  address: Yup.string().required('Address is required'),
  txcPayout: Yup.string().required('TxcPayout is required'),
  txcCold: Yup.string().required('TxcCold is requried'),
  isAdmin: Yup.boolean().required(),
});

export default function UserCreateForm() {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      username: '',
      fullname: '',
      sponsorName: '',
      introducerFullName: '',
      email: '',
      password: '',
      mobile: '',
      assetId: '',
      address: '',
      txcPayout: '',
      txcCold: '',
      isAdmin: false,
    }),
    []
  );

  const [submit, { loading }] = useMutation(CREATE_USER);

  const form = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { reset, setError, handleSubmit } = form;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await submit({ variables: { data } });
      reset();
      enqueueSnackbar('Create success!');
      router.push(path.dashboard.user.root);
    } catch (err) {
      if (err instanceof ApolloError) {
        const [error] = err.graphQLErrors;
        if (error.path?.includes('email')) {
          setError('email', { type: 'manual', message: error?.message || '' });
        }
      } else {
        enqueueSnackbar(err.message, { variant: 'error' });
      }
    }
  });

  return (
    <FormProvider form={form} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFSelectAvatar
                name="avatarUrl"
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Select your favorite avatar <br /> among 25 gorgeous avatars
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="subtitle2">Personal Information</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Personal information here.
              </Typography>
            </Stack>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Full Name" />
              <RHFTextField name="email" label="Email Address" />

              <RHFSwitch
                name="isSuperAdmin"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Admin
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Admin permission
                    </Typography>
                  </>
                }
                sx={{ mx: 0, px: 1, width: 1, justifyContent: 'space-between' }}
              />

              <RHFSwitch
                name="isEmailVerified"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Email Verified
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Disabling this will automatically send the user a verification email
                    </Typography>
                  </>
                }
                sx={{ mx: 0, px: 1, width: 1, justifyContent: 'space-between' }}
              />
            </Box>

            {/* <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Full Name" />
              <RHFTextField name="email" label="Email Address" />
            </Box> */}

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={loading}>
                Create User
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
