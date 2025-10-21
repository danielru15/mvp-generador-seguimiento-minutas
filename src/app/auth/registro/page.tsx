'use client';

import React from 'react';
import { Card, Typography, App, Divider } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RegistroForm } from '@/components/auth';
import { useAuth } from '@/hooks/useAuth';
import { RegistroFormValues } from '@/types/auth';

const { Title, Text } = Typography;

export default function RegistroPage() {
  const { message: messageApi } = App.useApp();
  const router = useRouter();
  const { registrarUsuario, loading } = useAuth();

  const handleRegistro = async (values: RegistroFormValues) => {
    try {
      await registrarUsuario(values);
      messageApi.success('¡Cuenta creada exitosamente!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error al registrar usuario:', error);
      
      // Mensajes de error personalizados
      let errorMessage = 'Error al crear la cuenta';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo ya está registrado';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Correo electrónico inválido';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil';
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
          maxWidth: '500px',
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
            <UserAddOutlined style={{ fontSize: '40px', color: 'white' }} />
          </div>
          <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
            Crear Cuenta
          </Title>
          <Text type="secondary">Regístrate para acceder al sistema</Text>
        </div>

        <RegistroForm onSubmit={handleRegistro} loading={loading} />

        <Divider style={{ margin: '24px 0' }} />

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/auth/login" style={{ color: '#7c3aed', fontWeight: 500 }}>
              Inicia sesión aquí
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}

