import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LoginFormValues, RegistroFormValues, Usuario } from '@/types/auth';

interface UseAuthReturn {
  loading: boolean;
  iniciarSesion: (values: LoginFormValues) => Promise<Usuario>;
  registrarUsuario: (values: RegistroFormValues) => Promise<Usuario>;
  cerrarSesion: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);

  const iniciarSesion = async (values: LoginFormValues): Promise<Usuario> => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const usuario: Usuario = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        emailVerified: userCredential.user.emailVerified,
      };

      return usuario;
    } finally {
      setLoading(false);
    }
  };

  const registrarUsuario = async (values: RegistroFormValues): Promise<Usuario> => {
    setLoading(true);
    try {
      // Crear usuario
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // Actualizar perfil con nombre si se proporcionó
      if (values.nombre) {
        await updateProfile(userCredential.user, {
          displayName: values.nombre,
        });
      }

      const usuario: Usuario = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: values.nombre || null,
        emailVerified: userCredential.user.emailVerified,
      };

      return usuario;
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = async (): Promise<void> => {
    setLoading(true);
    try {
      await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    iniciarSesion,
    registrarUsuario,
    cerrarSesion,
  };
};

