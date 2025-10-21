'use client';

import React from 'react';
import { ConfigProvider, App } from 'antd';
import esES from 'antd/locale/es_ES';

const AntdRegistry = ({ children }: React.PropsWithChildren) => {
  return (
    <ConfigProvider
      locale={esES}
      theme={{
        token: {
          colorPrimary: '#7c3aed', // Morado
          colorInfo: '#7c3aed',
          colorBgLayout: '#f5f5f7', // Gris claro
          colorBgContainer: '#ffffff',
          colorBorder: '#e5e7eb',
          colorText: '#374151',
          colorTextSecondary: '#6b7280',
          borderRadius: 8,
        },
        components: {
          Layout: {
            headerBg: '#ffffff',
            siderBg: '#1f2937', // Gris oscuro
            bodyBg: '#f5f5f7',
          },
          Menu: {
            darkItemBg: '#1f2937',
            darkItemSelectedBg: '#7c3aed',
            darkItemHoverBg: '#374151',
          },
        },
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
};

export default AntdRegistry;
