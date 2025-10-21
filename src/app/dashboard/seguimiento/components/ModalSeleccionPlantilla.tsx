import React, { useState, useEffect } from 'react';
import { Modal, List, Spin, Empty, Input, Typography } from 'antd';
import { FileWordOutlined, SearchOutlined } from '@ant-design/icons';
import { ref, listAll, ListResult } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const { Text } = Typography;

interface PlantillaFile {
  name: string;
  fullPath: string;
}

interface ModalSeleccionPlantillaProps {
  open: boolean;
  onCancel: () => void;
  onSelect: (plantillaUrl: string, plantillaNombre: string) => void;
  loading?: boolean;
}

export const ModalSeleccionPlantilla: React.FC<ModalSeleccionPlantillaProps> = ({
  open,
  onCancel,
  onSelect,
  loading = false,
}) => {
  const [plantillas, setPlantillas] = useState<PlantillaFile[]>([]);
  const [cargandoPlantillas, setCargandoPlantillas] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    if (open) {
      cargarPlantillas();
    }
  }, [open]);

  const cargarPlantillas = async () => {
    setCargandoPlantillas(true);
    try {
      // Referencia a la carpeta minutas en Firebase Storage
      const minutasRef = ref(storage, 'minutas/');
      
      // Listar todos los archivos
      const result: ListResult = await listAll(minutasRef);
      
      // Filtrar archivos .doc y .docx
      const plantillasDocx = result.items
        .filter(item => item.name.endsWith('.docx') || item.name.endsWith('.doc'))
        .map(item => ({
          name: item.name,
          fullPath: item.fullPath,
        }));
      
      setPlantillas(plantillasDocx);
    } catch (error) {
      console.error('Error al cargar plantillas:', error);
      setPlantillas([]);
    } finally {
      setCargandoPlantillas(false);
    }
  };

  const plantillasFiltradas = plantillas.filter(p =>
    p.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleSeleccion = (plantilla: PlantillaFile) => {
    onSelect(plantilla.fullPath, plantilla.name);
  };

  return (
    <Modal
      title="Seleccionar Plantilla"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <div style={{ marginBottom: '16px' }}>
        <Input
          placeholder="Buscar plantilla..."
          prefix={<SearchOutlined />}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          allowClear
        />
      </div>

      {cargandoPlantillas ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Cargando plantillas...</p>
        </div>
      ) : plantillasFiltradas.length === 0 ? (
        <Empty
          description={
            busqueda
              ? 'No se encontraron plantillas con ese nombre'
              : 'No hay plantillas disponibles'
          }
          style={{ padding: '40px 0' }}
        >
          {!busqueda && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Sube archivos .doc o .docx a la carpeta "minutas" en Firebase Storage
            </Text>
          )}
        </Empty>
      ) : (
        <List
          dataSource={plantillasFiltradas}
          renderItem={(plantilla) => (
            <List.Item
              style={{
                cursor: loading ? 'not-allowed' : 'pointer',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: '#fafafa',
                opacity: loading ? 0.6 : 1,
              }}
              onClick={() => !loading && handleSeleccion(plantilla)}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa';
              }}
            >
              <List.Item.Meta
                avatar={
                  <FileWordOutlined
                    style={{
                      fontSize: '32px',
                      color: '#2b579a',
                    }}
                  />
                }
                title={
                  <Text strong style={{ fontSize: '14px' }}>
                    {plantilla.name}
                  </Text>
                }
                description={
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {plantilla.fullPath}
                  </Text>
                }
              />
            </List.Item>
          )}
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '8px 0',
          }}
        />
      )}

      {plantillasFiltradas.length > 0 && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#e6f7ff',
            borderRadius: '4px',
            border: '1px solid #91d5ff',
          }}
        >
          <Text style={{ fontSize: '12px', color: '#0050b3' }}>
            💡 Haz clic en una plantilla para generar el documento
          </Text>
        </div>
      )}
    </Modal>
  );
};

