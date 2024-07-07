import * as Yup from 'yup';
import isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApolloError, useMutation } from '@apollo/client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { gql } from 'src/__generated__/gql';
import { User } from 'src/__generated__/graphql';

import { useSnackbar } from 'src/components/SnackBar';
import FormProvider, { RHFSwitch, RHFTextField, RHFSelectAvatar } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  currentUser: User;
};

// ----------------------------------------------------------------------

const UPDATE_USER = gql(/* GraphQL */ `
  mutation UpdateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      id
      username
      email
      isAdmin
    }
  }
`);

// ----------------------------------------------------------------------

const userSchema = Yup.object().shape({
  username: Yup.string().required('username is required'),
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  isAdmin: Yup.boolean().nullable(),
});

export default function UserGeneral({ currentUser }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [submit, { loading }] = useMutation(UPDATE_USER);

  const form = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: currentUser,
  });

  const { setError, handleSubmit } = form;

  const onSubmit = handleSubmit(async (newUser) => {
    try {
      if (isEqual(newUser, currentUser)) {
        enqueueSnackbar('No changes to save', { variant: 'warning' });
        return;
      }

      // Need to strip fields
      const data = await userSchema.validate(newUser, { stripUnknown: true });
      await submit({ variables: { data: { ...data, id: currentUser.id } } });
      enqueueSnackbar('Update success!');
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
                name="isApUser"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      AP user
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      AP user permission
                    </Typography>
                  </>
                }
                sx={{ mx: 0, px: 1, width: 1, justifyContent: 'space-between' }}
              />

              <RHFSwitch
                name="isBackOfficeUser"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Back Office User
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      AP user permission
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

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={loading}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
