'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Upload,
  Popconfirm,
  Tag,
  Progress,
  App,
} from 'antd';
import {
  UploadOutlined,
  FileTextOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import { storage } from '@/lib/firebase';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  listAll, 
  deleteObject,
  getMetadata 
} from 'firebase/storage';

const { Title } = Typography;
const { Dragger } = Upload;

interface ArchivoMinuta {
  key: string;
  nombre: string;
  url: string;
  tamaño: number;
  fechaSubida: string;
  tipo: string;
  path: string;
}

const Minutas: React.FC = () => {
  const { message: messageApi } = App.useApp();
  const [archivos, setArchivos] = useState<ArchivoMinuta[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Obtener el icono según el tipo de archivo
  const getFileIcon = (tipo: string) => {
    if (tipo.includes('pdf')) return <FilePdfOutlined style={{ color: '#ff4d4f', fontSize: '24px' }} />;
    if (tipo.includes('word') || tipo.includes('document')) return <FileWordOutlined style={{ color: '#1890ff', fontSize: '24px' }} />;
    if (tipo.includes('sheet') || tipo.includes('excel')) return <FileExcelOutlined style={{ color: '#52c41a', fontSize: '24px' }} />;
    return <FileOutlined style={{ color: '#7c3aed', fontSize: '24px' }} />;
  };

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Cargar lista de archivos desde Firebase Storage
  const cargarArchivos = async () => {
    setLoading(true);
    try {
      const listRef = ref(storage, 'minutas/');
      const res = await listAll(listRef);
      
      const archivosPromises = res.items.map(async (itemRef) => {
        const metadata = await getMetadata(itemRef);
        const url = await getDownloadURL(itemRef);
        
        return {
          key: itemRef.fullPath,
          nombre: itemRef.name,
          url: url,
          tamaño: metadata.size,
          fechaSubida: new Date(metadata.timeCreated).toLocaleString('es-ES'),
          tipo: metadata.contentType || 'unknown',
          path: itemRef.fullPath,
        };
      });

      const archivosData = await Promise.all(archivosPromises);
      setArchivos(archivosData);
      messageApi.success('Archivos cargados correctamente');
    } catch (error) {
      console.error('Error al cargar archivos:', error);
      messageApi.error('Error al cargar los archivos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar archivos al montar el componente
  useEffect(() => {
    cargarArchivos();
  }, []);

  // Configuración del upload
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.txt',
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        messageApi.error('El archivo debe ser menor a 10MB');
        return false;
      }
      handleUpload(file);
      return false; // Prevenir el upload automático
    },
    showUploadList: false,
  };

  // Subir archivo a Firebase Storage
  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const storageRef = ref(storage, `minutas/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error('Error al subir:', error);
          messageApi.error('Error al subir el archivo');
          setUploading(false);
        },
        async () => {
          messageApi.success(`${file.name} subido correctamente`);
          setUploading(false);
          setUploadProgress(0);
          // Recargar la lista de archivos
          await cargarArchivos();
        }
      );
    } catch (error) {
      console.error('Error:', error);
      messageApi.error('Error al procesar el archivo');
      setUploading(false);
    }
  };

  // Descargar archivo
  const handleDownload = (archivo: ArchivoMinuta) => {
    const link = document.createElement('a');
    link.href = archivo.url;
    link.download = archivo.nombre;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    messageApi.success('Descargando archivo...');
  };

  // Visualizar archivo
  const handleView = (archivo: ArchivoMinuta) => {
    window.open(archivo.url, '_blank');
  };

  // Eliminar archivo
  const handleDelete = async (archivo: ArchivoMinuta) => {
    try {
      const fileRef = ref(storage, archivo.path);
      await deleteObject(fileRef);
      messageApi.success('Archivo eliminado correctamente');
      await cargarArchivos();
    } catch (error) {
      console.error('Error al eliminar:', error);
      messageApi.error('Error al eliminar el archivo');
    }
  };

  const columns: ColumnsType<ArchivoMinuta> = [
    {
      title: 'Archivo',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (nombre, record) => (
        <Space>
          {getFileIcon(record.tipo)}
          <span style={{ fontWeight: 500 }}>{nombre}</span>
        </Space>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      width: 150,
      render: (tipo) => {
        const extension = tipo.split('/')[1]?.toUpperCase() || 'ARCHIVO';
        return <Tag color="purple">{extension}</Tag>;
      },
    },
    {
      title: 'Tamaño',
      dataIndex: 'tamaño',
      key: 'tamaño',
      width: 120,
      render: (tamaño) => formatFileSize(tamaño),
    },
    {
      title: 'Fecha de subida',
      dataIndex: 'fechaSubida',
      key: 'fechaSubida',
      width: 180,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
          >
            Ver
          </Button>
          <Button
            icon={<DownloadOutlined />}
            size="small"
            onClick={() => handleDownload(record)}
          >
            Descargar
          </Button>
          <Popconfirm
            title="¿Eliminar archivo?"
            description="Esta acción no se puede deshacer"
            onConfirm={() => handleDelete(record)}
            okText="Eliminar"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
          <FileTextOutlined style={{ color: '#7c3aed', marginRight: '8px' }} />
          Gestión de Minutas
        </Title>
        <p style={{ color: '#6b7280', marginTop: '8px' }}>
          Carga, visualiza y descarga archivos de minutas desde Firebase Storage
        </p>
      </div>

      {/* Área de carga */}
      <Card style={{ marginBottom: '24px' }}>
        <Dragger {...uploadProps} disabled={uploading}>
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ color: '#7c3aed', fontSize: '48px' }} />
          </p>
          <p className="ant-upload-text">
            Haz clic o arrastra un archivo para subirlo
          </p>
          <p className="ant-upload-hint">
            Soporta archivos PDF, Word, Excel (Máx. 10MB)
          </p>
        </Dragger>
        
        {uploading && (
          <div style={{ marginTop: '16px' }}>
            <Progress 
              percent={uploadProgress} 
              status="active"
              strokeColor={{ '0%': '#7c3aed', '100%': '#a78bfa' }}
            />
            <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '8px' }}>
              Subiendo archivo...
            </p>
          </div>
        )}
      </Card>

      {/* Estadísticas */}
      <Card style={{ marginBottom: '24px' }}>
        <Space size="large">
          <div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total de archivos</div>
            <div style={{ fontSize: '24px', fontWeight: 600, color: '#7c3aed' }}>
              {archivos.length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Tamaño total</div>
            <div style={{ fontSize: '24px', fontWeight: 600, color: '#7c3aed' }}>
              {formatFileSize(archivos.reduce((acc, curr) => acc + curr.tamaño, 0))}
            </div>
          </div>
        </Space>
      </Card>

      {/* Tabla de archivos */}
      <Card>
        <Table
          columns={columns}
          dataSource={archivos}
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} archivos`,
          }}
          locale={{
            emptyText: 'No hay archivos subidos aún',
          }}
        />
      </Card>
    </div>
  );
};

export default Minutas;
