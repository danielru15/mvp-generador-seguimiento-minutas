import React from 'react';
import { Modal, Form, Input, Select, Row, Col } from 'antd';
import type { FormInstance } from 'antd';

const { TextArea } = Input;

interface ModalEscrituraProps {
  open: boolean;
  loading: boolean;
  form: FormInstance;
  onOk: () => void;
  onCancel: () => void;
  modo?: 'crear' | 'editar';
}

export const ModalEscritura: React.FC<ModalEscrituraProps> = ({
  open,
  loading,
  form,
  onOk,
  onCancel,
  modo = 'crear',
}) => {
  const titulo = modo === 'crear' ? 'Crear Nuevo' : 'Editar Escritura';
  const textoBoton = modo === 'crear' ? 'Crear' : 'Actualizar';

  return (
    <Modal
      title={titulo}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
      okText={textoBoton}
      cancelText="Cancelar"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" style={{ marginTop: '20px' }}>
        <Form.Item
          name="ubicacion"
          label="Ubicación"
          rules={[{ required: true, message: 'Por favor ingresa la ubicación' }]}
        >
          <Input placeholder="Ej: Calle 123 # 45-67, Bogotá" />
        </Form.Item>

        <Form.Item
          name="nomenclatura"
          label="Nomenclatura"
          rules={[{ required: true, message: 'Por favor ingresa la nomenclatura' }]}
        >
          <Input placeholder="Ej: Calle 123 # 45-67" />
        </Form.Item>

        <Form.Item
          name="matriculasInmobiliarias"
          label="Matrículas Inmobiliarias"
          rules={[{ required: true, message: 'Por favor ingresa las matrículas inmobiliarias' }]}
        >
          <TextArea rows={2} placeholder="Ej: 50C-123456, 50C-789012" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="nombre"
              label="Nombre"
              rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
            >
              <Input placeholder="Nombre completo" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="identificacion"
              label="Identificación"
              rules={[{ required: true, message: 'Por favor ingresa la identificación' }]}
            >
              <Input placeholder="Ej: CC 1234567890" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="escritura" label="Escritura">
              <Input placeholder="Ej: ESC-2025-001" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="idVissagio"
              label="ID Vissagio"
              rules={[{ required: true, message: 'Por favor ingresa el ID Vissagio' }]}
            >
              <Input placeholder="Ej: VIS-123456" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="prioridad" label="Prioridad">
              <Select
                placeholder="Selecciona prioridad (opcional)"
                options={[
                  { value: 'alta', label: 'Alta' },
                  { value: 'media', label: 'Media' },
                  { value: 'baja', label: 'Baja' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="estado"
              label="Estado"
              rules={[{ required: true, message: 'Por favor selecciona el estado' }]}
              initialValue="envio_escrituracion"
            >
              <Select
                placeholder="Selecciona el estado"
                options={[
                  { value: 'envio_escrituracion', label: 'Envío Escrituración' },
                  { value: 'pendiente_firma', label: 'Pendiente de Firma' },
                  { value: 'enviadas_notaria', label: 'Enviadas Notaría' },
                  { value: 'regreso_registrada', label: 'Regreso Registrada' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

