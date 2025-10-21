'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { useAuthContext } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { usuario, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !usuario) {
      router.push('/auth/login');
    }
  }, [usuario, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Spin size="large" />
        <p style={{ color: '#6b7280' }}>Cargando...</p>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return <>{children}</>;
};

