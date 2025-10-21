'use client';

import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Space, Dropdown, App } from 'antd';
import {
  FileTextOutlined,
  CheckSquareOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { modal, message: messageApi } = App.useApp();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { usuario } = useAuthContext();
  const { cerrarSesion } = useAuth();

  const menuItems = [
    {
      key: '/dashboard/minutas',
      icon: <FileTextOutlined />,
      label: 'Minutas',
    },
    {
      key: '/dashboard/seguimiento',
      icon: <CheckSquareOutlined />,
      label: 'Seguimiento',
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Perfil',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configuración',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar sesión',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      modal.confirm({
        title: '¿Estás seguro de cerrar sesión?',
        content: 'Serás redirigido a la página de inicio de sesión',
        okText: 'Sí, cerrar sesión',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk: async () => {
          try {
            await cerrarSesion();
            messageApi.success('Sesión cerrada exitosamente');
            router.push('/auth/login');
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
            messageApi.error('Error al cerrar sesión');
          }
        },
      });
    } else if (key === 'profile') {
      messageApi.info('Función de perfil en desarrollo');
    } else if (key === 'settings') {
      messageApi.info('Función de configuración en desarrollo');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
        theme="dark"
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {!collapsed && (
            <Title level={4} style={{ color: '#ffffff', margin: 0 }}>
              Dashboard
            </Title>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ marginTop: '16px' }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header 
          style={{ 
            padding: '0 24px', 
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              style: { fontSize: '18px', cursor: 'pointer', color: '#374151' },
              onClick: () => setCollapsed(!collapsed),
            })}
          </div>
          <Dropdown 
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }} 
            placement="bottomRight"
          >
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#7c3aed' }} />
              <span style={{ color: '#374151' }}>
                {usuario?.displayName || usuario?.email || 'Usuario'}
              </span>
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            minHeight: 280,
            background: '#ffffff',
            borderRadius: '8px',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;

