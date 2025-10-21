'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { useAuthContext } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { usuario, loading } = useAuthContext();

  useEffect(() => {
    if (!loading) {
      if (usuario) {
        // Si el usuario está autenticado, redirigir al dashboard
        router.push('/dashboard/minutas');
      } else {
        // Si no está autenticado, redirigir al login
        router.push('/auth/login');
      }
    }
  }, [usuario, loading, router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Spin size="large" />
      <p style={{ color: '#ffffff', fontSize: '16px' }}>Cargando...</p>
    </div>
  );
}
