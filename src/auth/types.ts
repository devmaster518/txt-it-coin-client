import { User } from 'src/__generated__/graphql';

// ----------------------------------------------------------------------
// Partial<User> because graphql does not fetch all fields
export type AuthUserType = Partial<User> | null | undefined;

// ----------------------------------------------------------------------

type CanRemove = {
  forgotPassword?: (email: string) => Promise<void>;
  resendCodeRegister?: (email: string) => Promise<void>;
  newPassword?: (email: string, code: string, password: string) => Promise<void>;
  updatePassword?: (password: string) => Promise<void>;
};

export type AuthContextType = CanRemove & {
  user: AuthUserType;
  isAuthenticated: boolean;
  loading: boolean;
  fetchMe: (token?: string) => void;
  logout: () => void;
};
