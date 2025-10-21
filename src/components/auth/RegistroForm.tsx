import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { RegistroFormValues } from '@/types/auth';

interface RegistroFormProps {
  onSubmit: (values: RegistroFormValues) => Promise<void>;
  loading: boolean;
}

export const RegistroForm: React.FC<RegistroFormProps> = ({ onSubmit, loading }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: RegistroFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form
      form={form}
      name="registro"
      onFinish={handleSubmit}
      layout="vertical"
      size="large"
      autoComplete="off"
    >
      <Form.Item
        name="nombre"
        label="Nombre completo"
        rules={[{ required: false }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Tu nombre"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        name="email"
        label="Correo electrónico"
        rules={[
          { required: true, message: 'Por favor ingresa tu correo' },
          { type: 'email', message: 'Ingresa un correo válido' },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="correo@ejemplo.com"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Contraseña"
        rules={[
          { required: true, message: 'Por favor ingresa una contraseña' },
          { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Mínimo 6 caracteres"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirmar contraseña"
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: 'Por favor confirma tu contraseña' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Las contraseñas no coinciden'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Repite tu contraseña"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          style={{ height: '48px', fontSize: '16px', fontWeight: 500 }}
        >
          Crear Cuenta
        </Button>
      </Form.Item>
    </Form>
  );
};

