export interface Usuario {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegistroFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  nombre?: string;
}

