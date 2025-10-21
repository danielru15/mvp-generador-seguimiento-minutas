'use client';

import React, { useState } from 'react';
import { Typography, Spin, Form, App } from 'antd';
import { CheckSquareOutlined } from '@ant-design/icons';
import {
  EstadisticasCards,
  FiltrosAcciones,
  TablaEscrituras,
  ModalEscritura,
  ModalSeleccionPlantilla,
} from './components';
import { useEscrituras } from './hooks/useEscrituras';
import { calcularEstadisticas } from './utils/estadisticas';
import { crearAccionesHandlers } from './utils/acciones';
import { aplicarFiltros } from './utils/filtros';
import { generarDocumentoEscritura } from './utils/documentos';
import { Escritura } from './types';

const { Title } = Typography;

const Seguimiento: React.FC = () => {
  const { modal, message: messageApi } = App.useApp();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [saving, setSaving] = useState(false);
  const [modoModal, setModoModal] = useState<'crear' | 'editar'>('crear');
  const [escrituraEnEdicion, setEscrituraEnEdicion] = useState<Escritura | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todas');
  
  // Estados para modal de plantillas
  const [isModalPlantillaOpen, setIsModalPlantillaOpen] = useState(false);
  const [escrituraParaDoc, setEscrituraParaDoc] = useState<Escritura | null>(null);
  const [generandoDoc, setGenerandoDoc] = useState(false);

  // Hook personalizado para manejar escrituras
  const { escrituras, loading, crearEscritura, actualizarEscritura, eliminarEscritura } = useEscrituras(messageApi);

  // Aplicar filtros
  const escriturasFiltradas = aplicarFiltros(escrituras, {
    estado: filtroEstado,
    prioridad: filtroPrioridad,
  });

  // Calcular estadísticas con datos filtrados
  const estadisticas = calcularEstadisticas(escrituras);

  // Función para abrir modal en modo edición
  const abrirModalEdicion = (record: Escritura) => {
    setModoModal('editar');
    setEscrituraEnEdicion(record);
    form.setFieldsValue({
      ubicacion: record.ubicacion,
      nomenclatura: record.nomenclatura,
      matriculasInmobiliarias: record.matriculasInmobiliarias,
      nombre: record.nombre,
      identificacion: record.identificacion,
      escritura: record.escritura,
      idVissagio: record.idVissagio,
      prioridad: record.prioridad,
      estado: record.estado,
    });
    setIsModalOpen(true);
  };

  // Función para abrir modal de selección de plantilla
  const abrirModalPlantilla = (record: Escritura) => {
    setEscrituraParaDoc(record);
    setIsModalPlantillaOpen(true);
  };

  // Función para manejar la selección de plantilla
  const handleSeleccionPlantilla = async (plantillaPath: string, plantillaNombre: string) => {
    if (!escrituraParaDoc) return;

    try {
      setGenerandoDoc(true);
      messageApi.loading('Generando documento...', 0);

      await generarDocumentoEscritura(plantillaPath, plantillaNombre, escrituraParaDoc);

      messageApi.destroy();
      messageApi.success('Documento generado exitosamente');
      setIsModalPlantillaOpen(false);
      setEscrituraParaDoc(null);
    } catch (error) {
      console.error('Error al generar documento:', error);
      messageApi.destroy();

      if (error instanceof Error) {
        messageApi.error('Error al generar documento: ' + error.message);
      } else {
        messageApi.error('Error al generar el documento');
      }
    } finally {
      setGenerandoDoc(false);
    }
  };

  // Función para cancelar selección de plantilla
  const handleCancelarPlantilla = () => {
    setIsModalPlantillaOpen(false);
    setEscrituraParaDoc(null);
  };

  // Crear handlers de acciones
  const { handleEdit, handleDelete, handleGenerateDoc } = crearAccionesHandlers(
    messageApi,
    modal,
    eliminarEscritura,
    abrirModalEdicion,
    abrirModalPlantilla
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleFiltrarEstado = (value: string) => {
    setFiltroEstado(value);
  };

  const handleFiltrarPrioridad = (value: string) => {
    setFiltroPrioridad(value);
  };

  const showModal = () => {
    setModoModal('crear');
    setEscrituraEnEdicion(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      
      if (modoModal === 'crear') {
        await crearEscritura(values);
      } else {
        if (escrituraEnEdicion) {
          await actualizarEscritura(escrituraEnEdicion.key, values);
        }
      }
      
      form.resetFields();
      setIsModalOpen(false);
      setEscrituraEnEdicion(null);
    } catch (error) {
      console.error(`Error al ${modoModal} escritura:`, error);
      if (error instanceof Error) {
        messageApi.error(`Error al ${modoModal === 'crear' ? 'crear' : 'actualizar'} la escritura: ` + error.message);
      } else {
        messageApi.error(`Error al ${modoModal === 'crear' ? 'crear' : 'actualizar'} la escritura`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setEscrituraEnEdicion(null);
    setModoModal('crear');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column', gap: '16px' }}>
        <Spin size="large" />
        <p style={{ color: '#6b7280' }}>Cargando escrituras...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Título */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
          <CheckSquareOutlined style={{ color: '#7c3aed', marginRight: '8px' }} />
          Seguimiento Futuras Escrituras
        </Title>
      </div>

      {/* Estadísticas */}
      <EstadisticasCards
        total={estadisticas.total}
        envioEscrituracion={estadisticas.envioEscrituracion}
        pendientesFirma={estadisticas.pendientesFirma}
        enviadasNotaria={estadisticas.enviadasNotaria}
        regresoRegistrada={estadisticas.regresoRegistrada}
        tasaCompletados={estadisticas.tasaCompletados}
      />

      {/* Filtros y Acciones */}
      <FiltrosAcciones 
        onSearch={handleSearch} 
        onClickCrear={showModal}
        onFiltrarEstado={handleFiltrarEstado}
        onFiltrarPrioridad={handleFiltrarPrioridad}
      />

      {/* Tabla */}
      <TablaEscrituras
        data={escriturasFiltradas}
        loading={false}
        searchText={searchText}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onGenerateDoc={handleGenerateDoc}
      />

      {/* Modal Crear/Editar */}
      <ModalEscritura
        open={isModalOpen}
        loading={saving}
        form={form}
        onOk={handleOk}
        onCancel={handleCancel}
        modo={modoModal}
      />

      {/* Modal Selección de Plantilla */}
      <ModalSeleccionPlantilla
        open={isModalPlantillaOpen}
        onCancel={handleCancelarPlantilla}
        onSelect={handleSeleccionPlantilla}
        loading={generandoDoc}
      />
    </div>
  );
};

export default Seguimiento;
