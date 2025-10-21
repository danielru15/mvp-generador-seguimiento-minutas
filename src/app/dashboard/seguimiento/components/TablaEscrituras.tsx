import React from 'react';
import { Card, Table, Tag, Avatar, Space, Button, Dropdown } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Escritura } from '../types';

interface TablaEscriturasProps {
  data: Escritura[];
  loading: boolean;
  searchText: string;
  onEdit: (record: Escritura) => void;
  onDelete: (record: Escritura) => void;
  onGenerateDoc: (record: Escritura) => void;
}

export const TablaEscrituras: React.FC<TablaEscriturasProps> = ({
  data,
  loading,
  searchText,
  onEdit,
  onDelete,
  onGenerateDoc,
}) => {
  const getActionMenuItems = (record: Escritura): MenuProps['items'] => [
    {
      key: 'edit',
      label: 'Editar',
      icon: <EditOutlined />,
      onClick: () => onEdit(record),
    },
    {
      key: 'delete',
      label: 'Eliminar',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => onDelete(record),
    },
    {
      type: 'divider',
    },
    {
      key: 'generate',
      label: 'Generar doc',
      icon: <FileTextOutlined />,
      onClick: () => onGenerateDoc(record),
    },
  ];

  const columns: ColumnsType<Escritura> = [
    {
      title: 'Ubicación',
      dataIndex: 'ubicacion',
      key: 'ubicacion',
      width: 200,
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.ubicacion.toLowerCase().includes(value.toString().toLowerCase()) ||
        record.nomenclatura.toLowerCase().includes(value.toString().toLowerCase()) ||
        record.nombre.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: 'Nomenclatura',
      dataIndex: 'nomenclatura',
      key: 'nomenclatura',
      width: 150,
    },
    {
      title: 'Matrículas Inmobiliarias',
      dataIndex: 'matriculasInmobiliarias',
      key: 'matriculasInmobiliarias',
      width: 180,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      width: 180,
      render: (nombre) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#7c3aed' }} />
          {nombre}
        </Space>
      ),
    },
    {
      title: 'Identificación',
      dataIndex: 'identificacion',
      key: 'identificacion',
      width: 130,
    },
    {
      title: 'Escritura',
      dataIndex: 'escritura',
      key: 'escritura',
      width: 120,
    },
    {
      title: 'ID Vissagio',
      dataIndex: 'idVissagio',
      key: 'idVissagio',
      width: 120,
    },
    {
      title: 'Prioridad',
      dataIndex: 'prioridad',
      key: 'prioridad',
      width: 100,
      render: (prioridad: string) => {
        const colorMap = {
          alta: 'red',
          media: 'orange',
          baja: 'blue',
        };
        const textMap = {
          alta: 'Alta',
          media: 'Media',
          baja: 'Baja',
        };
        return <Tag color={colorMap[prioridad as keyof typeof colorMap]}>{textMap[prioridad as keyof typeof textMap]}</Tag>;
      },
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 180,
      render: (estado: string) => {
        const config = {
          envio_escrituracion: { color: 'default', icon: <ClockCircleOutlined />, text: 'Envío Escrituración' },
          pendiente_firma: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Pendiente de Firma' },
          enviadas_notaria: { color: 'processing', icon: <CheckCircleOutlined />, text: 'Enviadas Notaría' },
          regreso_registrada: { color: 'success', icon: <CheckCircleOutlined />, text: 'Regreso Registrada' },
        };
        const { color, icon, text } = config[estado as keyof typeof config];
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 130,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown menu={{ items: getActionMenuItems(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />}>
            Acciones
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <Card>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Total ${total} escrituras`,
        }}
        locale={{
          emptyText: 'No hay escrituras registradas. Abre la consola del navegador para ver los logs de carga.',
        }}
      />
    </Card>
  );
};

