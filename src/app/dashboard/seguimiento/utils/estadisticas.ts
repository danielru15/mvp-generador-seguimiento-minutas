import { Escritura } from '../types';

export interface Estadisticas {
  total: number;
  envioEscrituracion: number;
  pendientesFirma: number;
  enviadasNotaria: number;
  regresoRegistrada: number;
  tasaCompletados: number;
}

export const calcularEstadisticas = (data: Escritura[]): Estadisticas => {
  const total = data.length;
  const envioEscrituracion = data.filter((a) => a.estado === 'envio_escrituracion').length;
  const pendientesFirma = data.filter((a) => a.estado === 'pendiente_firma').length;
  const enviadasNotaria = data.filter((a) => a.estado === 'enviadas_notaria').length;
  const regresoRegistrada = data.filter((a) => a.estado === 'regreso_registrada').length;
  const tasaCompletados = total > 0 ? Math.round((regresoRegistrada / total) * 100) : 0;

  return {
    total,
    envioEscrituracion,
    pendientesFirma,
    enviadasNotaria,
    regresoRegistrada,
    tasaCompletados,
  };
};

