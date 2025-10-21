import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { LoginFormValues } from '@/types/auth';

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: LoginFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={handleSubmit}
      layout="vertical"
      size="large"
      autoComplete="off"
    >
      <Form.Item
        name="email"
        label="Correo electrónico"
        rules={[
          { required: true, message: 'Por favor ingresa tu correo' },
          { type: 'email', message: 'Ingresa un correo válido' },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="correo@ejemplo.com"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Contraseña"
        rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Contraseña"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: '8px' }}>
        <Checkbox disabled={loading}>Recordarme</Checkbox>
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          style={{ height: '48px', fontSize: '16px', fontWeight: 500 }}
        >
          Iniciar Sesión
        </Button>
      </Form.Item>
    </Form>
  );
};

