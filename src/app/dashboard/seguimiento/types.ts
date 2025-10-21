export interface Escritura {
  key: string;
  id: string;
  ubicacion: string;
  nomenclatura: string;
  matriculasInmobiliarias: string;
  nombre: string;
  identificacion: string;
  escritura: string;
  idVissagio: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'envio_escrituracion' | 'pendiente_firma' | 'enviadas_notaria' | 'regreso_registrada';
  progreso: number;
}

export interface EscrituraFormValues {
  ubicacion: string;
  nomenclatura: string;
  matriculasInmobiliarias: string;
  nombre: string;
  identificacion: string;
  escritura?: string;
  idVissagio: string;
  prioridad?: string;
  estado: string;
}

