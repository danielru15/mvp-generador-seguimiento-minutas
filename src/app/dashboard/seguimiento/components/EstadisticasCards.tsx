import React from 'react';
import { Card, Statistic, Row, Col, Progress } from 'antd';
import {
  CheckSquareOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

interface EstadisticasCardsProps {
  total: number;
  envioEscrituracion: number;
  pendientesFirma: number;
  enviadasNotaria: number;
  regresoRegistrada: number;
  tasaCompletados: number;
}

export const EstadisticasCards: React.FC<EstadisticasCardsProps> = ({
  total,
  envioEscrituracion,
  pendientesFirma,
  enviadasNotaria,
  regresoRegistrada,
  tasaCompletados,
}) => {
  return (
    <>
      {/* Estadísticas */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Total"
              value={total}
              prefix={<CheckSquareOutlined style={{ color: '#7c3aed' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Envío Escrituración"
              value={envioEscrituracion}
              valueStyle={{ color: '#8c8c8c' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Pendientes Firma"
              value={pendientesFirma}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Enviadas Notaría"
              value={enviadasNotaria}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Regreso Registrada"
              value={regresoRegistrada}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Progreso general */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '8px', fontWeight: 500 }}>
              Progreso General
            </div>
            <Progress
              percent={tasaCompletados}
              strokeColor={{ '0%': '#7c3aed', '100%': '#a78bfa' }}
              status="active"
            />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: '#7c3aed' }}>
            {tasaCompletados}%
          </div>
        </div>
      </Card>
    </>
  );
};

