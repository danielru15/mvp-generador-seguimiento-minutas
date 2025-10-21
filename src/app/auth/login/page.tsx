'use client';

import React from 'react';
import { Card, Typography, App, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoginForm } from '@/components/auth';
import { useAuth } from '@/hooks/useAuth';
import { LoginFormValues } from '@/types/auth';

const { Title, Text } = Typography;

export default function LoginPage() {
  const { message: messageApi } = App.useApp();
  const router = useRouter();
  const { iniciarSesion, loading } = useAuth();

  const handleLogin = async (values: LoginFormValues) => {
    try {
      await iniciarSesion(values);
      messageApi.success('¡Bienvenido!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      
      // Mensajes de error personalizados
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Correo o contraseña incorrectos';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este correo';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Error de conexión. Verifica tu internet';
      }
      
      messageApi.error(errorMessage);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '450px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          borderRadius: '16px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <UserOutlined style={{ fontSize: '40px', color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
            Iniciar Sesión
          </Title>
          <Text type="secondary">Accede a tu cuenta de seguimiento</Text>
        </div>

        <LoginForm onSubmit={handleLogin} loading={loading} />

        <Divider style={{ margin: '24px 0' }} />

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            ¿No tienes una cuenta?{' '}
            <Link href="/auth/registro" style={{ color: '#7c3aed', fontWeight: 500 }}>
              Regístrate aquí
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}

