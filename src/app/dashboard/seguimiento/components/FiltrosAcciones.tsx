import React from 'react';
import { Card, Space, Input, Select, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

interface FiltrosAccionesProps {
  onSearch: (value: string) => void;
  onClickCrear: () => void;
  onFiltrarEstado: (value: string) => void;
  onFiltrarPrioridad: (value: string) => void;
}

export const FiltrosAcciones: React.FC<FiltrosAccionesProps> = ({
  onSearch,
  onClickCrear,
  onFiltrarEstado,
  onFiltrarPrioridad,
}) => {
  return (
    <Card style={{ marginBottom: '16px' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
        <Space wrap>
          <Input
            placeholder="Buscar por ubicación, nombre o nomenclatura..."
            prefix={<SearchOutlined />}
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: 350 }}
          />
          <Select
            placeholder="Estado"
            style={{ width: 220 }}
            allowClear
            onChange={(value) => onFiltrarEstado(value || 'todos')}
            options={[
              { value: 'todos', label: 'Todos' },
              { value: 'envio_escrituracion', label: 'Envío Escrituración' },
              { value: 'pendiente_firma', label: 'Pendiente de Firma' },
              { value: 'enviadas_notaria', label: 'Enviadas Notaría' },
              { value: 'regreso_registrada', label: 'Regreso Registrada' },
            ]}
          />
          <Select
            placeholder="Prioridad"
            style={{ width: 150 }}
            allowClear
            onChange={(value) => onFiltrarPrioridad(value || 'todas')}
            options={[
              { value: 'todas', label: 'Todas' },
              { value: 'alta', label: 'Alta' },
              { value: 'media', label: 'Media' },
              { value: 'baja', label: 'Baja' },
            ]}
          />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={onClickCrear}>
          Crear Nuevo
        </Button>
      </Space>
    </Card>
  );
};

