'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redireccionar automáticamente a la página de minutas
    router.push('/dashboard/minutas');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh',
    }}>
      <Spin size="large" />
    </div>
  );
}

